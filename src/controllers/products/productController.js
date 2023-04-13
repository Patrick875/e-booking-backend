import {
  Product,
  Package,
  ProductCategory,
  ProductPackage,
  PetitStockSale,
  PetitStock,
  PetitStockSaleDetail,
} from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const CreateProduct = asyncWrapper(async (req, res) => {
  if (!req.body?.name) {
    return res
      .status(400)
      .json({ status: "error", message: "name and Category is required" });
  }

  if (!req.body?.packages || !req.body?.packages[0].price) {
    return res.status(400).json({
      status: "error",
      message: " Packages and Price per package are required",
    });
  }

  if (await Product.findOne({ where: { name: req.body.name } })) {
    return res.status(409).json({
      status: `error`,
      message: `Product '${req.body.name}' already  exists`,
    });
  }

  for (let element of req.body.packages) {
    if (!(await Package.findByPk(element.packageId))) {
      return res.status(404).json({
        status: "error",
        message: `Package ${element.packageId} not found`,
      });
    }
  }

  const product = await Product.create({
    name: req.body.name,
  });

  for (let element of req.body.packages) {
    await ProductPackage.create({
      ProductId: product.id,
      PackageId: element.packageId,
      price: element.price,
      items: element.items,
      unit: element.unit,
    });
  }
  const data = await Product.findByPk(product.id, {
    include: [
      {
        model: Package,
        include: [
          {
            model: ProductCategory,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
  });

  return res.status(200).json({ status: "ok", data });
});

const UpdateProduct = asyncWrapper(async (req, res) => {
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

  product.set({
    name: req.body.name ? req.body.name : product.name,
  });

  await product.save();

  return res
    .status(200)
    .json({ status: "success", message: "Product updated successfully" });
});

const DeleteProduct = asyncWrapper(async (req, res) => {
  if (!req.params.id || isNaN(req.params.id)) {
    return res
      .status(404)
      .json({ status: "error", message: "Product Id is required" });
  }

  const product = await Product.findByPk(req.params.id);

  if (!product)
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });

  await product.destroy();
  return res.status(200).json({ status: "ok", message: "Product deleted" });
});

const GetAllProducts = asyncWrapper(async (req, res) => {
  const data = await Product.findAll({
    order: [["id", "DESC"]],
    include: [
      {
        model: Package,
        include: [
          {
            model: ProductCategory,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "PackageId",
            "ProductId",
            "categoryId",
          ],
        },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  return res.status(200).json({ status: "ok", data });
});

const GetProductById = asyncWrapper(async (req, res) => {
  if (!req.params.id)
    return res
      .status(400)
      .json({ status: "error", message: "Product id is required" });

  const product = await Product.findByPk(req.params.id, {
    include: [
      {
        model: Package,
        include: [
          {
            model: ProductCategory,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "PackageId",
            "ProductId",
            "categoryId",
          ],
        },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  if (!product) {
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });
  }
  return res.status(200).json({ status: "ok", data: product });
});

const sell = asyncWrapper(async (req, res) => {
  if (!req.body.packages) {
    return res
      .status(404)
      .json({ status: "error", message: "packages key is required" });
  }

  let amount = 0;
  for (let element of req.body.packages) {
    if (!(await PetitStock.findOne({ where: { name: element.petitStock } }))) {
      return res
        .status(400)
        .json({
          status: "error",
          message: `no stock named ${element.petitStock}`,
        });
    }

    // let pkg = await ProductPackage.findOne({include : [ { model : Product}, { model: Package, where : { id :  }} ] })
    let pkg = await Package.findByPk(element.packageId, {
      include: [{ model: Product }],
    });

    if (!pkg) {
      return res
        .status(404)
        .json({
          status: "error",
          message: ` Package related to ${element.packageId} not found`,
        });
    }
    let productOne = pkg.toJSON().Products.filter((prod) => {
      console.log(prod.id, element.productId);
      return Number(prod.id) == Number(element.productId);
    });

    amount =
      amount + Number(productOne[0].ProductPackage.price * element.quantity);
  }

  const petitStockRow = await PetitStock.findOne({
    where: { name: req.body.packages[0].petitStock },
  });

  console.log(petitStockRow);

  const petitStockSale = await PetitStockSale.create({
    status: "PENDING",
    userId: req.user.id,
    petiStockId: petitStockRow.id,
    amount,
    date: new Date(),
  });

  if (petitStockSale) {
    for (let element of req.body.packages) {
      await PetitStockSaleDetail.create({
        packageId: element.packageId,
        productId: element.productId,
        quantity: element.quantity,
        petitStockSaleId: petitStockSale.id,
      });
    }
  }

  const data = await PetitStockSale.findByPk(petitStockSale.id, {
    include: [
      {
        model: PetitStockSaleDetail,
        include: [{ model: Product }, { model: Package }],
      },
    ],
  });

  return res
    .status(200)
    .json({ status: "success", data, message: "Successfully Product sold" });
});

export default {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetAllProducts,
  GetProductById,
  sell,
};
