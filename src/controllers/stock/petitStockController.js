import { PetitStock, PetitStockItem, StockItemNew } from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const index = asyncWrapper(async (req, res) => {
  const data = await PetitStock.findAll({
    include: [
      {
        model: PetitStockItem,
        include: [
          { model: StockItemNew,
          attributes: { exclude: ["createdAt", "updatedAt"] }},
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return res.status(200).json({ status: "success", data });
});

const show = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: "error", message: "Id is required" });
  const petitStock = await PetitStock.findByPk(id);

  if (!petitStock)
    return res
      .status(404)
      .json({ status: "error", message: "Petit stock not found" });

  const data = await PetitStock.findByPk(id, {
    include: [
      {
        model: PetitStockItem,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return res.status(200).json({ status: "success", data });
});

const create = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(404)
      .json({ status: "error", message: " Name is required " });
  }
  const data = await PetitStock.create({ ...req.body, status: "ACTIVE" });
  return res.status(200).json({
    status: "success",
    message: "Petit stock created Successfully",
    data,
  });
});

const activatePetitStock = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: "error", message: "Id is required" });
  const petitStock = await PetitStock.findByPk(id);

  if (!petitStock)
    return res
      .status(404)
      .json({ status: "error", message: "Petit stock not found" });
  petitStock.set({ status: "ACTIVE" });
  await petitStock.save();
  return res.status(200).json({
    status: "success",
    message: "Petit stock Activated successfully",
    data: petitStock,
  });
});

const disActivatePetitStock = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ status: "error", message: "Id is required" });
  const petitStock = await PetitStock.findByPk(id);

  if (!petitStock)
    return res
      .status(404)
      .json({ status: "error", message: "Petit stock not found" });
  petitStock.set({ status: "DISACTIVE" });
  await petitStock.save();
  return res.status(200).json({
    status: "success",
    message: "Petit stock Disactivated successfully",
    data: petitStock,
  });
});
const balance = asyncWrapper(async (req, res) => {
  const data = await PetitStockItem.findAll({
    include: [
      { model: StockItemNew, attributes: { exclude: ["createdAt", "updatedAt"] } },
      {
        model: PetitStock,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  return res.status(200).json({ status: "success", data });
});

export default {
  index,
  create,
  show,
  activatePetitStock,
  balance,
  disActivatePetitStock,
};
