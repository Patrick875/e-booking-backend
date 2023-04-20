import { json } from "sequelize";
import { Customer, Reservation, Room, Hall, RoomClass } from "../models";
import { asyncWrapper } from '../utils/handlingTryCatchBlocks'
const CreateCustomer = asyncWrapper(async (req, res) => {
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


    const result = await Customer.create(req.body);
    return res.status(201).json({ status: `success`, data: result });

});

const DeleteCustomer = asyncWrapper(async (req, res) => {
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

  customer.destroy();
  
  return res.status(200).json({ status: `success`, message: `customer destroyed` });
  //  To be completed
});

const UpdateCustomer = asyncWrapper(async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({
      status: `error`,
      message: `id is required to update a customer`,
    });
  }

  const customer = await Customer.findByPk(req.body.id);

  if (!customer) {
    return res.status(404).json({
      status: `error`,
      message: `customer with id ${req.body.id} not found`,
    });
  }

  customer.set(req.body);
  await customer.save();

  return res.status(200).json({
    status: `success`,
    data: customer,
    message: "you have successfully updated the customer",
  });
});

const GetAllCustomers = asyncWrapper(async (req, res) => {

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
      order: [['createdAt', 'DESC']]

    },
    );

    return res.status(200).json({ status: `ok`, data: customers });

});

export default {
  CreateCustomer,
  DeleteCustomer,
  UpdateCustomer,
  GetAllCustomers,
};
