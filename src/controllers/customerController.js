import { Customer, Reservation, Room, Hall, RoomClass } from "../models";

const CreateCustomer = async (req, res) => {
  let error = "";
  let is_valid = true;
  const validationArr = [
    "names",
    "email",
    "phone",
    "nationality",
    "identification",
    "customerType",
  ];
  validationArr.forEach((element) => {
    if (
      req.body[element] == undefined ||
      req.body[element] == "" ||
      !req.body[element]
    ) {
      console.log(element);
      error += `${element} ,`;
      is_valid = false;
    }
  });

  if (!is_valid) {
    return res
      .status(400)
      .json({ status: `error`, message: ` ${error} is required\n` });
  }

  try {
    const result = await Customer.create(req.body);
    return res.status(201).json({ status: `success`, data: result });
  } catch (error) {
    return res.status(500).json({ status: `error`, message: error });
  }
};

const DeleteCustomer = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      status: `error`,
      message: `id is required to delete a customer`,
    });
  }

  const customer = await Customer.findByPk(req.params.id);
  if (!customer) {
    return res
      .status(404)
      .json({ status: `error`, message: `customer not found` });
  }

  customer.update({ status: `deleted` });
  //  To be completed
};

const UpdateCustomer = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({
      status: `error`,
      message: `id is required to update a customer`,
    });
  }

  const customer = await Customer.findByPk(req.params.id);

  if (!customer) {
    return res.status(404).json({
      status: `error`,
      message: `customer with id ${req.params.id} not found`,
    });
  }

  customer.set(req.body);
  await customer.save();

  return res.status(200).json({
    status: `success`,
    data: customer,
    message: "you have successfully updated the customer",
  });
};

const GetAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [
        {
          model: Reservation,
          include: [
            {
              model: Room,
              include: [
                {
                  model: RoomClass,
                  attributes: { exclude: ["createdAt", "updatedAt"] },

                }
              ],
              attributes: { exclude: ["createdAt", "updatedAt", "roomClassId"] },
            },
            {
              model: Hall,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
          attributes: { exclude: ["createdAt", "updatedAt","roomId", "customerId","hallId"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    return res.status(200).json({ status: `ok`, data: customers });
  } catch (error) {
    return res.status(500).json({ status: `error`, message: error });
  }
};

export default {
  CreateCustomer,
  DeleteCustomer,
  UpdateCustomer,
  GetAllCustomers,
};
