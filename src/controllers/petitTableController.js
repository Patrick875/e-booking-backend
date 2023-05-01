import { PetitTable} from "../models";
import { asyncWrapper } from "../utils/handlingTryCatchBlocks";

const index = asyncWrapper(async (req, res) => {
  const data = await PetitTable.findAll({
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
  const data = await PetitTable.create({...req.body, status: "ACTIVE"});
  return res.status(200).json({
    status: "success",
    message: "Petit stock created Successfully",
    data,
  });
});

const destroy = asyncWrapper ( async( req, res) => {
    const { id } = req.params;
    if(!id) {
        return res.status(400).json({status: 'error', message: ' Id is required'});
    }
    const table = await PetitTable.findByPk(id);
    if(!table) {
        return res.status(404).json({status: 'error', message: 'Table not found'});
    }

    await table.destroy();
    return res.status(204).json({status: 'error', message: 'Table deleted'});
})

const disActivateTable = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ status: "error", message: "Id is required" });
    const table = await PetitTable.findByPk(id);
  
    if (!table)
      return res
        .status(404)
        .json({ status: "error", message: "Table not found" });
    table.set({ status: "DISACTIVE" });
    await table.save();
    return res.status(200).json({
      status: "success",
      message: "Table Disactivated successfully",
      data: table,
    });
  });

  const activateTable = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ status: "error", message: "Id is required" });
    const table = await PetitTable.findByPk(id);
  
    if (!table)
      return res
        .status(404)
        .json({ status: "error", message: "Table not found" });
    table.set({ status: "ACTIVE" });
    await table.save();
    return res.status(200).json({
      status: "success",
      message: "table Activated successfully",
      data: table,
    });
  });

export default {
  index,
  create,
  destroy,
  disActivateTable,
  activateTable
};
