import { BonDeCommande, BonDeCommandeDetail, User } from "../../models";

import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
import generateId from "../../utils/generateChonologicId";

const create = asyncWrapper(async (req, res) => {
  const  data  = req.body;

  if (!data.details) {
    return res
      .status(400)
      .json({ status: "error", message: "Details is requried " });
  }
  let total = 0;

  for (let dataElement of data.details) {
    if (
      !dataElement.quantity ||
      !dataElement.times ||
      !dataElement.price ||
      !dataElement.description
    ) {
      return res.status(404).json({
        status: "error",
        message: `Quantity, times, price and description are both required`,
      });
    }

    total =
      total +
      Number(
           dataElement.price *
          dataElement.quantity *
          (dataElement?.times ? dataElement?.times : 1)
      );
  }

  const bondocommand = await BonDeCommande.create({
    userId: req?.user?.id,
    company: data.company,
    date_from: data.date_from,
    date_to: data.date_to,
    function: data.function,
    fax: data.fax,
    total,
    status: "PENDING",
    BonCommandeId: `BC_${await generateId(BonDeCommande)}`,
  });

  for (let element of data.details) {
    await BonDeCommandeDetail.create({
      description: element.description,
      times: element.times,
      quantity: element.quantity,
      unitPrice: Number(element.price),
      VAT: element.VAT,
      commandId: bondocommand.id,
    });
  }

  const delivery = await BonDeCommande.findByPk(bondocommand.id, {
    include: {
      model: BonDeCommandeDetail,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  return res.status(200).json({
    status: "success",
    message: " Successfull Delivery note created sent ",
    data: delivery,
  });
});

const index = asyncWrapper(async (req, res) => { 
  const data = await BonDeCommande.findAll({
    include: [{
      model: BonDeCommandeDetail,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
    {
      model: User,
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "refreshToken",
          "password",
          "verifiedAT",
        ],
      },
    },]
  });

  return res.status(200).json({ status: "success", data });
});

const approve = asyncWrapper(async (req, res) => {
  const { id } = req.body;
  if (!request)
    return res.status(404).json({
      status: "error",
      message: "The ID is required",
    });

  let delivery = await BonDeCommande.findByPk(id, {
    include: [
      {
        model: BonDeCommandeDetail,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });

  if (!delivery)
    return res.status(404).json({
      status: "error",
      message: "Delivery note related to this Id not found",
    });

  await BonDeCommande.update({ status: "APPROVED" }, { where: { id } });

  return res
    .status(200)
    .json({ status: "OK", message: "Request approved", data: delivery });
});

const show = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ status: "error", message: " Id is required" });
  }

  const data = await BonDeCommande.findByPk(req.params.id, {
    include: [
      {
        model: BonDeCommandeDetail,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });

  return res.status(200).json({ status: "Ok", data });
});

const destroy = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ status: "error", message: "Id is required" });
  }

  const request = await BonDeCommande.findByPk(req.params.id);

  if (!request) {
    return res
      .status(200)
      .json({ status: "success", message: " BonDeCommande not found" });
  }

  await request.destroy({
    include: [
      {
        model: BonDeCommandeDetail,
        as: "BonDeCommandeDetails",
      },
    ],
  });
  return res
    .status(200)
    .json({ status: "success", message: "BonDeCommande successfully destroyed" });
});

export default { create, index, approve, show, destroy };
