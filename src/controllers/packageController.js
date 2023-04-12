import { Package, Product, ProductCategory } from "../models";
import { asyncWrapper } from "../utils/handlingTryCatchBlocks";

const CreatePackage = asyncWrapper(async (req, res) => {
  if (!req.body.name || !req.body.category) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Package name and category is required",
      });
  }

  const category = await ProductCategory.findByPk(req.body.category);
  if (!category) {
    return res
      .status(400)
      .json({ status: "error", message: "Category does not exist" });
  }

  const result = await Package.create({
    ...req.body,
    categoryId: req.body.category,
  });
  return res.status(201).json({
    status: "ok",
    message: "package created successfully",
    data: result,
  });
});

const UpdatePackage = asyncWrapper(async (req, res) => {
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

  packages.set({
    ...req.body,
    categoryId: req.body?.category ? req.body.category : packages.categoryId,
  });
  await packages.save();
  return res.status(200).json({
    status: "ok",
    message: "package updated successfully",
    data: packages,
  });
});

const DeletePackage = asyncWrapper(async (req, res) => {
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
});

const GetPackage = asyncWrapper(async (req, res) => {
  if (!req.params?.id) {
    return res
      .status(400)
      .json({ status: "error", message: "Package id is required" });
  }
  const packages = await Package.findByPk(req.params.id, {
    include: [Product, ProductCategory],
  });
  return res.status(200).json({ status: "ok", data: packages });
});

const GetPackages = asyncWrapper(async (req, res) => {
  const packages = await Package.findAll({
    order: [["id", "DESC"]],
    include: [
      {
        model: Product,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: ProductCategory,
        attributes: { exclude: ["createdAt", "updatedAt", "categoryId"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt", "categoryId"] },
  });
  return res.status(200).json({ status: "ok", data: packages });
});

export default {
  CreatePackage,
  UpdatePackage,
  DeletePackage,
  GetPackages,
  GetPackage,
};
