import {
  Reservation,
  Customer,
  Room,
  Hall,
  Role,
  User,
  HallService,
  ReservationService,
  ReservationTransaction,
  PetitStockReservation,
  Product,
  Package,
  PetitStock
} from "../models";
import { asyncWrapper } from "../utils/handlingTryCatchBlocks";
import currencyController from "./currencyController";
import generateId from '../utils/generateChonologicId'

const AllReservations = asyncWrapper(async (req, res) => {
  // Set up pagination options
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (page - 1) * limit;

  // const dataItems = await Reservation.findAndCountAll({
  const dataItems = await Reservation.findAll({
    include: [
      { model: Customer, attributes: { exclude: ["createdAt", "updatedAt"] } },
      { model: Room, attributes: { exclude: ["createdAt", "updatedAt"] } },
      { model: Hall, attributes: { exclude: ["createdAt", "updatedAt"] } },
      {
        model: User,
        include: [
          {
            model: Role,
            attributes: {
              exclude: ["createdAt", "updatedAt", "access", "permission"],
            },
          },
        ],
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "refreshToken",
            "password",
            "roleId",
          ],
        },
      },
      {
        model: HallService,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      {
        model: ReservationTransaction,
        attributes: { exclude: ["createdAt", "updated"] },
      },
      {
        model : PetitStockReservation
      }
    ],
    order : [['createdAt', 'DESC']]
  });

  // const totalPages = Math.ceil(dataItems.count / limit);
  const currentPage = parseInt(page);
  const itemsPerPage = parseInt(limit);

  // const totalItems = dataItems.rows.length;
  // const totalPages = Math.ceil(totalItems / limit);

  return res.status(200).json({ status: "ok", data: dataItems });
  // return res.status(200).json({ status: "ok", data : {
  //   offset,
  //   totalItems,
  //   totalPages,
  //   currentPage,
  //   itemsPerPage,
  //   items: dataItems.rows
  // } });
});

const CreateReservation = asyncWrapper(async (req, res) => {
  const validationArr = ["checkIn", "checkOut", "booking_type", "customerId"];
  let errors;
  let is_valid = true;

  validationArr.forEach((item) => {
    if (!req.body[item]) {
      errors += item;
    }
  });

  if (!is_valid) {
    return res.status(400).json({ error: `${errors} are required` });
  }

  if (!req.body.roomId && !req.body.hallId && !req.body.details) {
    return res
      .status(400)
      .json({ error: "roomId, hallId and details can't both be empty" });
  }

  if (req.body?.roomId) {
    const room = await Room.findByPk(req.body.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
  }
  if (req.body?.hallId) {
    const hall = await Hall.findByPk(req.body.hallId);
    if (!hall) {
      return res.status(404).json({ error: "Hall not found" });
    }
  }

  if (req.body?.customerId) {
    const customer = await Customer.findByPk(req.body.customerId);
    if (!customer) {
      return res
        .status(404)
        .json({ status: `error`, message: "customer not found" });
    }
  }

  if (req.body?.userId) {
    const user = await User.findByPk(req.body.userId);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "user not found" });
    }
  }

  if (req.body.packages && req.body.packages.length) {
    for (let pack of req.body.packages) {
      let product = await Product.findByPk(pack.productId, {
        include: [{ model: Package, where: { id: pack.packageId } }],
      });

      if (!product) {
        return res
          .status(404)
          .json({
            status: "error",
            message: "Product not found or not associated with a package",
          });
      }

      // console.log(product.Packages.ProductPackage)

      if(! await PetitStock.findByPk(pack.petitStockId)){
        return res.status(404).json({status: "error", message: "Petit stock not registered"});
      }

    }
  }

  const amountObj = {};
  const paymentObj = {};

  const convertedAmount = await currencyController.currencyConvert(
    req.body.currency,
    "RWF",
    req.body.amount
  );
  const convertedPayment = await currencyController.currencyConvert(
    req.body.currency,
    "RWF",
    req.body.payment
  );

  amountObj[req.body.currency] = req.body.amount;
  amountObj.RWF = convertedAmount;

  paymentObj[req.body.currency] = req.body.payment;
  paymentObj.RWF = convertedPayment;

  if (paymentObj.RWF > amountObj.RWF) {
    return res.status(400).json({
      status: "error",
      message: "Payment amaunt can't exceed possible amount RWF",
    });
  }

  const reservation = await Reservation.create({
    ...req.body,
    userId: req.user.id || req.userId,
    amount: amountObj,
    payment: paymentObj,
    bookingId : `BH_${await generateId(Reservation)}`
    
  });

  Object.keys(req.body).forEach(async (key, val) => {
    let services = {};
    if (key.startsWith("service_")) {
      services.HallServiceId = Number(key.split("_")[1]);
      services.ReservationId = reservation.id;
      services.quantity = req.body[key];

      let svces = await HallService.findByPk(Number(key.split("_")[1]));
      if (svces) {
        await ReservationService.create(services);
      }
    }
  });

  if (req.body.packages && req.body.packages.length) {
    for (let pack of req.body.packages) {
      await PetitStockReservation.create({
        packageId: pack.packageId,
        productId: pack.productId,
        quantity: pack.quantity,
        status: "PENDING",
        reservationId: reservation.id,
        petitStockItemId: pack.petitStockId,
        petitStockId: pack.petitStockId,
      });
    }
  }


  saveReservationTrans(reservation.id, req.body);

  const data = await Reservation.findByPk(reservation.id, {
    include: [
      {
        model: Customer,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      { model: Room, attributes: { exclude: ["createdAt", "updatedAt"] } },
      {
        model: Hall,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: User,
        include: [
          {
            model: Role,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "refreshToken",
            "password",
            "roleId",
          ],
        },
      },
      {
        model: HallService,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: ReservationTransaction,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });
  return res.status(201).json({ status: "ok", data });
});

const PayReservation = asyncWrapper(async (req, res) => {
  if (!req.body?.reservationId) {
    return res
      .status(400)
      .json({ status: "error", message: " Reservation Id is required " });
  }

  if (!req.body?.payment || !req.body?.currency) {
    return res.status(400).json({
      status: "error",
      message: "The payment amount and currency is required",
    });
  }

  const reservation = await Reservation.findByPk(req.body.reservationId);
  if (!reservation) {
    return res
      .status(404)
      .json({ status: "error", message: "Reservation not found in database" });
  }

  if (!req.body.paymentMethod) {
    return res
      .status(400)
      .json({ status: "error", message: "Payment Method is required" });
  }

  if (reservation.payment[req.body.currency] == undefined) {
    return res.status(400).json({
      status: "error",
      message: "Payment currency should be the same",
    });
  }

  const transction = saveReservationTrans(req.body.reservationId, {
    ...req.body,
    amount: parseInt(req.body.payment),
  });

  let amountObj = reservation.amount;
  let paymentObj = reservation.payment;

  if (transction) {
    let paymentCurrency = req.body.currency.toString();

    if (paymentCurrency in paymentObj) {
      for (let key in paymentObj) {
        paymentObj[key] =
          Number(paymentObj[key]) +
          Number(
            await currencyController.currencyConvert(
              req.body.currency,
              key,
              req.body.payment
            )
          );
      }
    } else {
      return res.status(400).json({
        status: "error",
        message: "Payment currency #",
      });
    }
  }

  if (paymentObj.RWF > amountObj.RWF) {
    return res.status(400).json({
      status: "error",
      message: "Payment amount can not go beyond the price of the service",
    });
  }

  await Reservation.update(
    { amount: amountObj, payment: paymentObj },
    { where: { id: req.body.reservationId } }
  );

  return res.status(200).json({
    status: "success",
    message: ` The amaunt ${req.body.payment} is paid for the reservation ${reservation.id} `,
    data: reservation,
  });
});

const GetReservation = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ error: "id is required" });

  const reservation = await Reservation.findByPk(req.params.id, {
    include: Customer,
  });

  if (!reservation)
    return res.status(404).json({
      status: "error",
      message: "Reservation not with this id not found",
    });

  return res.status(200).json({ status: "ok", data: reservation });
};

const UpdateReservation = async (req, res) => {
  if (!req.body.id)
    return res.status(400).json({ status: "error", message: "id is required" });
  const reservation = await Reservation.findByPk(req.body.id);

  if (!reservation)
    return res
      .status(404)
      .json({ status: "error", message: "Reservation not found" });

  reservation.set(req.body);
  await reservation.save();

  return res.status(200).json({ status: "ok", data: reservation });
};

const ChechOutReservation = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ error: "id is required" });

  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation)
    return res
      .status(404)
      .json({ status: "error", message: "Reservation not found" });

  await reservation.update({ status: "out" });

  return res.status(200).json({ status: "ok", data: reservation });
};

const saveReservationTrans = asyncWrapper(async (reservationId, options) => {
  await ReservationTransaction.create({
    date: new Date(),
    payment: options.payment,
    paymentMethod: options.paymentMethod,
    currency: options.currency,
    amount: options.amount,
    reservationId,
  });
});
const DeleteReservation = asyncWrapper(async (req, res) => {
  const id = req.params?.id;
  if (!id) {
    return res
      .status(400)
      .json({ status: "error", message: "Reservation id is required" });
  }

  const reservation = await Reservation.findByPk(id);

  if (!reservation) {
    return res
      .status(404)
      .json({ status: "error", message: "Reservation not found" });
  }

  await reservation.destroy();

  return res
    .status(200)
    .json({ status: "success", message: "Reservation successfully deleted" });
});
export default {
  DeleteReservation,
  AllReservations,
  PayReservation,
  CreateReservation,
  UpdateReservation,
  ChechOutReservation,
  GetReservation,
};
