import { ConstantNew } from "../models";
import { asyncWrapper } from "../utils/handlingTryCatchBlocks";

const create = asyncWrapper(async (req, res) => {
  if (!req.body.name || !req.body.value) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Name  and value is required",
      });
  }



  const result = await ConstantNew.create(req.body);
  return res.status(201).json({
    status: "ok",
    message: "Constant created successfully",
    data: result,
  });
});

const update = asyncWrapper(async (req, res) => {
  if (!req.body?.id)
    return res
      .status(400)
      .json({ status: "error", message: "Constant id is required to update" });

  const constants = await ConstantNew.findByPk(req.body.id);

  if (!constants)
    return res.status(404).json({
      status: "error",
      message: "Constant with id '" + req.body.id + "' not found",
    });

  constants.set({
    ...req.body  });
  await constants.save();
  return res.status(200).json({
    status: "ok",
    message: "Constant updated successfully",
    data: constants,
  });
});

const destroy = asyncWrapper(async (req, res) => {
  if (!req.params?.id) {
    return res
      .status(400)
      .json({ status: "error", message: "Constant id is required to delete" });
  }

  const constants = await ConstantNew.findByPk(req.params.id);
  if (!constants) {
    return res.status(404).json({
      status: "error",
      message: `Constants with id ${req.params.id} not found`,
    });
  }

  await constants.destroy();

  return res.status(200).json({
    status: "ok",
    message: `Constant with id ${req.params.id} deleted`,
  });
});

const show = asyncWrapper(async (req, res) => {
  if (!req.params?.id) {
    return res
      .status(400)
      .json({ status: "error", message: "Constant id is required" });
  }
  const constants = await ConstantNew.findByPk(req.params.id);
  return res.status(200).json({ status: "ok", data: constants });
});

const index = asyncWrapper(async (req, res) => {
  const constants = await ConstantNew.findAll({
    order: [["id", "DESC"]],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return res.status(200).json({ status: "ok", data: constants });
});

export default {
  create,
  update,
  destroy,
  index,
  show,
};
