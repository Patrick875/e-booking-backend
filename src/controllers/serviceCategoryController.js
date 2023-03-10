import { ServiceCategory , Service } from "../models";

const CreateServiceCategory = async (req, res) => {
  if (!req.body?.name) {
    return res
      .status(400)
      .json({ status: "error", message: "Name is required" });
  }
  const category = await ServiceCategory.create(req.body);
  return res.status(201).json({ status: "ok", data: category });
};

const UpdateServiceCategory = async (req, res) => {
  if (!req.body?.id || !req.body?.name) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid request" });
  }

  const category = await ServiceCategory.findByPk(req.body.id);
  if (!category) {
    return res
      .status(400)
      .json({ status: "error", message: "category not found" });
  }

  category.set({
    name: req.body.name,
  });

  await category.save();

  return res.status(200).json({ status: "ok", data: category });
};

const DeleteServiceCategory = async (req, res) => {
  if (!req.params?.id) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid request" });
  }
  const category = await ServiceCategory.findByPk(req.params.id);
  if (!category)
    return res
      .status(400)
      .json({ status: "error", message: "category not found" });
  await category.destroy();
  return res.status(200).json({ status: "ok", message: "category deleted" });
};

const GetServiceCategory = async (req, res) => {
  if (!req.params?.id) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid request" });
  }
  const category = await ServiceCategory.findByPk(req.params.id,{include: [{model: Service}]});
  if (!category)
    return res
      .status(400)
      .json({ status: "error", message: "category not found" });

  return res.status(200).json({ status: "ok", data: category });
};

const GetServiceCategories = async (req, res) => {
  const categories = await ServiceCategory.findAll({include: [{model: Service}]});
  return res.status(200).json({ status: "ok", data: categories });
};

export default {
  CreateServiceCategory,
  UpdateServiceCategory,
  DeleteServiceCategory,
  GetServiceCategory,
  GetServiceCategories,
};
