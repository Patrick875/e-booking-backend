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
} from "../models";
import { asyncWrapper } from "../utils/handlingTryCatchBlocks";
import currencyController from "./currencyController";

const AllReservations = asyncWrapper(async (req, res) => {
  const data = await Reservation.findAll({
    include: [
      { model: Customer, attributes: { exclude: ["createdAt", "updatedAt"] } },
      { model: Room, attributes: { exclude: ["createdAt", "updatedAt"] } },
      { model: Hall, attributes: { exclude: ["createdAt", "updatedAt"] } },
      {
        model: User,
        include: [{ model : Role , attributes: { exclude: ["createdAt", "updatedAt", "access", "permission"] } }],
        attributes: {
          exclude: ["createdAt", "updatedAt", "refreshToken", "password", "roleId"],
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
    ],
  });

  return res.status(200).json({ status: "ok", data });
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

  const reservation = await Reservation.create({
    ...req.body,
    amount: amountObj,
    payment: paymentObj,
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
        include : [{
          model : Role,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }],
        attributes: {
          exclude: ["createdAt", "updatedAt", "refreshToken", "password", "roleId"],
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

const PayReservation = asyncWrapper( async (req, res) => {
  if(!req.params?.reservationId){
    return res.status(400).json({ status: "error", message: " Reservation Id is required " });  }

    if(!req.body?.amount || !req.body?.currency){
      return res.status(400).json({ status: "error" , message: "The amount and currency is required" });
    }
    
    const reservation = await Reservation.findByPk(req.params.reservationId);
    if(reservation) {
      return res.status(404).json({status: "error", message: "Reservation not found in database"})
    }
    
})


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
const DeleteReservation = asyncWrapper ( async ( req, res ) => {
  const id = req.params?.id;
  if(!id) {
    return res.status(400).json({ status: 'error', message: 'Reservation id is required'})
  }

  const reservation = await Reservation.findByPk(id)

  if(!reservation) {
    return res.status(404).json({ status: 'error', message: 'Reservation not found'})
  }

  await reservation.destroy();

  return res.status(200).json({ status: 'success' , message: 'Reservation successfully deleted' })

} )
export default {
  DeleteReservation,
  AllReservations,
  PayReservation,
  CreateReservation,
  UpdateReservation,
  ChechOutReservation,
  GetReservation,
};
