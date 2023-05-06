import { ProformaInvoice, ProformaDetail, User } from "../../models";

import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
import generateId from "../../utils/generateChonologicId";

const create = asyncWrapper(async (req, res) => {
  const  data  = req.body;

  if (!data.details || !data.clientName || !data.clientType || !data.function) {
    return res
      .status(400)
      .json({ status: "error", message: "Details ,clientName, clientType  is requried " });
  }
  let total = 0;

  for (let dataElement of data.details) {
    if (
      !dataElement.quantity ||
      !dataElement.times ||
      !dataElement.price ||
      !dataElement.name
    ) {
      return res.status(404).json({
        status: "error",
        message: `Quantity, times, price and name are both required under details`,
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

  const invoice = await ProformaInvoice.create({
    userId: req?.user?.id,
    clientName: data.clientName,
    clientType: data.clientType,
    function: data.function,
    total,
    status: "PENDING",
    proformaGenerated: `PI_${await generateId(ProformaInvoice)}`

  });

  for (let element of data.details) {
    await ProformaDetail.create({
      name: element.name,
      times: element.times,
      quantity: element.quantity,
      price: element.price,
      VAT: element.VAT,
      invoiceId: invoice.id,
    });
  }

  const delivery = await ProformaInvoice.findByPk(invoice.id, {
    include: {
      model: ProformaDetail,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  return res.status(200).json({
    status: "success",
    message: " Successfully created sent",
    data: delivery,
  });
});

const index = asyncWrapper(async (req, res) => {
  const data = await ProformaInvoice.findAll({
    include: [{
      model: ProformaDetail,
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
    },
  ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  return res.status(200).json({ status: "success", data });
});

const approve = asyncWrapper(async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(404).json({
      status: "error",
      message: "The ID is required",
    });

  let invoice = await ProformaInvoice.findByPk(id, {
    include: [
      {
        model: ProformaDetail,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["updatedAt"] },
  });

  if (!invoice)
    return res.status(404).json({
      status: "error",
      message: "Delivery note related to this Id not found",
    });

  await ProformaInvoice.update({ status: "APPROVED" }, { where: { id } });

  return res
    .status(200)
    .json({ status: "OK", message: "ProformaInvoice approved", data: invoice });
});

const show = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ status: "error", message: " Id is required" });
  }

  const data = await ProformaInvoice.findByPk(req.params.id, {
    include: [
      {
        model: ProformaDetail,
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

  const proforma = await ProformaInvoice.findByPk(req.params.id);

  if (!proforma) {
    return res
      .status(200)
      .json({ status: "success", message: " ProformaDetail not found" });
  }

  await proforma.destroy({
    include: [
      {
        model: ProformaDetail,
        as: "ProformaDetails",
      },
    ],
  });
  return res
    .status(200)
    .json({ status: "success", message: "ProformaDetail successfully destroyed" });
});

export default { create, index, approve, show, destroy };
