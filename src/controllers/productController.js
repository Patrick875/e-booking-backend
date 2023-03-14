import { Product, Package, ProductCategory, ProductPackage } from "../models";

const CreateProduct = async (req, res) => {
  if (!req.body?.name) {
    return res
      .status(400)
      .json({ status: "error", message: "name and Category is required" });
  }

  const product = await Product.create({
    name: req.body.name,
  });

  Object.keys(req.body).forEach(async (key, val) => {
    let packages = {};
    if (key.startsWith("package_")) {
      packages.PackageId = Number(key.split("_")[1]);
      packages.ProductId = product.id;
      packages.price = req.body[key];

      console.log(packages);

      let pkg = await Package.findByPk(Number(key.split("_")[1]));
      if (pkg) {
        await ProductPackage.create(packages);
      }
      else{
        await product.destroy();

      }
    }
  });

  return res.status(200).json({ status: "ok", data: product });
};

const UpdateProduct = (req, res) => {
  if (!req.body.id) {
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });
  }

  const product = Product.findByPk(req.body.id);
  if (!product)
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });

  Product.set({
    name: req.body.name ? req.body.name : product.name,
  });
};

const DeleteProduct = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(404)
      .json({ status: "error", message: "Product Id is required" });
  }

  const product = Product.findByPk(req.params.id);

  if (!product)
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });

  await product.destroy();
  return res.status(200).json({ status: "ok", message: "Product deleted" });
};

const GetAllProducts = async (req, res) => {
  const products = await Product.findAll(
    { order: [["id", "DESC"]], include: [Package]  }
  );
  return res.status(200).json({ status: "ok", data: products });
};

const GetProductById = async (req, res) => {
  if (!req.params.id)
    return res
      .status(400)
      .json({ status: "error", message: "Product id is required" });

  const product = Product.findByPk(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });
  }
  return res.status(200).json({ status: "ok", data: product });
};

export default {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetAllProducts,
  GetProductById,
};
