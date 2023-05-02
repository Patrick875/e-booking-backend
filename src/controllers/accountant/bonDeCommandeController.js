import { BonCommande, BonCommandeDetail } from "../../models";

import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
import generateId from "../../utils/generateChonologicId";

const create = asyncWrapper(async (req, res) => {
  const { data } = req.body;

  if (!data.details) {
    return res
      .status(400)
      .json({ status: "error", message: "petit stock is requried " });
  }
  let total = 0;

  for (let dataElement of data.details) {
    if (
      !dataElement.quantinty ||
      !dataElement.times ||
      !dataElement.unitPrice ||
      !dataElement.description
    ) {
      return res.status(404).json({
        status: "error",
        message: `Quantity, times, unitPrice and description are both required`,
      });
    }

    total = total + Number(item.price * dataElement.quantity * (dataElement?.times ? dataElement?.times : 1 ) );
  }

  const bondocommand = await BonCommande.create({
    userId: req?.user?.id,
    company: data.company,
    date_from: data.date_from,
    date_to: data.date_to,
    total,
    status: "PENDING",
    BonCommandeId: `DN_${await generateId(BonCommande)}`,
  });

  for (let element of data.details) {
    await BonCommandeDetail.create({
      description: element.description,
      times: element.times,
      unitPrice: unitPrice.quantinty,
      commandId: bondocommand.id,
    });
  }

  const delivery = await BonCommande.findByPk(BonCommande.id, {
    include: {
      model: BonCommandeDetail,
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
  const data = await BonCommande.findAll({
    include: {
      model: BonCommandeDetail,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
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

  let delivery = await BonCommande.findByPk(id, {
    include: [
      {
        model: BonCommandeDetail,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  if (!delivery)
    return res.status(404).json({
      status: "error",
      message: "Delivery note related to this Id not found",
    });

  await BonCommande.update({ status: "APPROVED" }, { where: { id } });

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

  const data = await BonCommande.findByPk(req.params.id, {
    include: [
      {
        model: BonCommandeDetail,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  return res.status(200).json({ status: "Ok", data });
});

const destroy = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ status: "error", message: "Id is required" });
  }

  const request = await BonCommande.findByPk(req.params.id);

  if (!request) {
    return res
      .status(200)
      .json({ status: "success", message: " BonCommande not found" });
  }

  await request.destroy();
  return res
    .status(200)
    .json({ status: "success", message: "BonCommande successfully destroyed" });
});

export default { create, index, approve, show, destroy };
