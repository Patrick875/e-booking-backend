import { Product, Package, ProductCategory, ProductPackage } from "../models";

const CreateProduct = async (req, res) => {
  if (!req.body?.name || !req.body?.category) {
    return res
      .status(400)
      .json({ status: "error", message: "name and Category is required" });
  }

  const category = await ProductCategory.findByPk(req.body.category);

  if (!category)
    return res
      .status(404)
      .json({ status: "error", message: "Category not found" });

  // return res.status(200).json( { status: "success", data:  req.body.package_1 } );

  const product = await Product.create({
    name: req.body.name,
    product_categoryId: req.body.category,
  });

  Object.keys(req.body).forEach(async (key, val) => {
    let packages = {};
    if (key.startsWith("package_")) {
      packages.packageId = Number(key.split("_")[1]);
      packages.productId = product.id;
      packages.price = req.body[key];

      let pkg = await Package.findByPk(packages.packageId);
      if (pkg) {
        await ProductPackage.create(packages);
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
    product_categoryId: req.body.category
      ? req.body.category
      : product.category,
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
  const products = await Product.findAll({
    include: [Package, ProductCategory],
  });
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
