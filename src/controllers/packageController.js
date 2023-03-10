import { Package, Product } from "../models";

const CreatePackage = async (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ status: "error", message: "Package name is required" });
  }

  const result = await Package.create(req.body);
  return res.status(201).json({
    status: "ok",
    message: "package created successfully",
    data: result,
  });
};

const UpdatePackage = async (req, res) => {
  if (!req.body?.id)
    return res
      .status(400)
      .json({ status: "error", message: "Package id is required to update" });

  const packages = await Package.findByPk(req.body.id);

  if (!packages)
    return res.status(404).json({
      status: "error",
      message: "Package with id '" + req.body.id + "' not found",
    });

  packages.set(req.body);
  await packages.save();
  return res.status(200).json({status: "ok", message: "package updated successfully", data: packages});
};

const DeletePackage = async (req, res) => {
  if (!req.params?.id) {
    return res
      .status(400)
      .json({ status: "error", message: "Package id is required to delete" });
  }

  const packages = await Package.findByPk(req.params.id);
  if (!packages) {
    return res.status(404).json({
      status: "error",
      message: `Package with id ${req.params.id} not found`,
    });
  }

  await packages.destroy();

  return res.status(200).json({
    status: "ok",
    message: `Package with id ${req.params.id} deleted`,
  });
};

const GetPackage = async (req, res) => {
  if (!req.params?.id) {
    return res
      .status(400)
      .json({ status: "error", message: "Package id is required" });
  }
  const packages = await Package.findByPk( req.params.id, { include: [Product] });
  return res.status(200).json({ status: "ok", data: packages });
};

const GetPackages = async (req, res) => {
  const packages = await Package.findAll({ include: [Product] });
  return res.status(200).json({ status: "ok", data: packages });
};

export default {
  CreatePackage,
  UpdatePackage,
  DeletePackage,
  GetPackages,
  GetPackage,
};
