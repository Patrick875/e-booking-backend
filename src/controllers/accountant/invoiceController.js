import { Invoiced, InvoiceDetail } from "../../models";

import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
import generateId from "../../utils/generateChonologicId";

const create = asyncWrapper(async (req, res) => {
  const  data  = req.body;

  if (!data.details || !data.clientName || !data.clientType || !data.function) {
    return res
      .status(400)
      .json({ status: "error", message: "details ,clientName, clientType , function is requried " });
  }
  let total = 0;

  for (let dataElement of data.details) {
    if (
      !dataElement.quantity ||
      !dataElement.times ||
      (!dataElement.price && !dataElement.unitPrice),
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

  const invoice = await Invoiced.create({
    userId: req?.user?.id,
    clientName: data.clientName,
    clientType: data.clientType,
    function: data.function,
    total,
    status: "PENDING",
    invoiceGenerated: `IV_${await generateId(Invoiced)}`,
  });

  for (let element of data.details) {
    await InvoiceDetail.create({
      name: element.name,
      times: element.times,
      quantity: element.quantity,
      price: element?.price ||  element?.uniPrice,
      VAT: element.VAT,
      invoiceId: invoice.id,
    });
  }

  const delivery = await dd.findByPk(invoice.id, {
    include: {
      model: InvoiceDetail,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  return res.status(200).json({
    status: "success",
    message: " Successfull Delivery note created sent",
    data: delivery,
  });
});

const index = asyncWrapper(async (req, res) => {
  const data = await dd.findAll({
    include: {
      model: InvoiceDetail,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
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

  let invoice = await dd.findByPk(id, {
    include: [
      {
        model: InvoiceDetail,
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

  await dd.update({ status: "APPROVED" }, { where: { id } });

  return res
    .status(200)
    .json({ status: "OK", message: "d approved", data: invoice });
});

const show = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ status: "error", message: " Id is required" });
  }

  const data = await dd.findByPk(req.params.id, {
    include: [
      {
        model: InvoiceDetail,
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

  const invoice = await dd.findByPk(req.params.id);

  if (!invoice) {
    return res
      .status(200)
      .json({ status: "success", message: " InvoiceDetail not found" });
  }

  await invoice.destroy({
    include: [
      {
        model: InvoiceDetail,
        as: "InvoiceDetails",
      },
    ],
  });
  return res
    .status(200)
    .json({ status: "success", message: "InvoiceDetail successfully destroyed" });
});

export default { create, index, approve, show, destroy };
