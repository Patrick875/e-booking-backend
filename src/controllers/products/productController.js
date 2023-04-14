import {
  Product,
  Package,
  ProductCategory,
  ProductPackage,
  PetitStockSale,
  PetitStock,
  User,
  PetitStockSaleDetail,
} from "../../models";
import CircularJSON from 'circular-json'
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
  if (!req.body.productId) {
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });
  }

  const product = Product.findByPk(req.body.id);
  if (!product)
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });


  for (let element of req.body.packages) {

  const product = Product.findByPk(req.body.id, {  });
  if (!product)
    return res
      .status(404)
      .json({ status: "error", message: "Product not found" });


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
      return res.status(400).json({
        status: "error",
        message: `no stock named ${element.petitStock}`,
      });
    }

    // let pkg = await ProductPackage.findOne({include : [ { model : Product}, { model: Package, where : { id :  }} ] })
    let pkg = await Package.findByPk(element.packageId, {
      include: [{ model: Product }],
    });

    if (!pkg) {
      return res.status(404).json({
        status: "error",
        message: ` Package related to ${element.packageId} not found`,
      });
    }
    let productOne = pkg.toJSON().Products.filter((prod) => {
      return Number(prod.id) == Number(element.productId);
    });

    amount =
      amount + Number(productOne[0].ProductPackage.price * element.quantity);
  }

  const petitStockRow = await PetitStock.findOne({
    where: { name: req.body.packages[0].petitStock },
  });

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

const allSalles = asyncWrapper(async (req, res) => {
  const data = await PetitStockSale.findAll({
    include: [
      {
        model: PetitStockSaleDetail,
        include: [
          {
            model: Package,
            include: [
              {
                model: Product,
                attributes: { exclude: ["createdAt", "updatedAt"] },
              },
            ],
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt", "packageId", "petitStockSaleId"],
        },
      },
      {
        model: PetitStock,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: User,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "refreshToken",
            "password",
            "verifiedAT",
          ],
        },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });


  let newData = [];
  let newArray = [];
  for (let item of data) {
    let details = [];

    let detail = item.PetitStockSaleDetails.map((el) => ({
      ...el.toJSON(),
      Package: {
        ...el.toJSON().Package,
        Products: el
          .toJSON()
          .Package.Products.find((prod) => prod.id == el.productId)[0],
      },
    }));

    let { PetitStockSaleDetails, ...otherKeys } = item;

    details.push(detail);
    newData.push({ ...otherKeys });

  }

    
  newArray = data.map((item) => ({
    id: item.dataValues.id,
    date: item.dataValues.date,
    petiStockId: item.dataValues.petiStockId,
    userId: item.dataValues.userId,
    amount: item.dataValues.amount,
    status: item.dataValues.status,
    petitStockSaleDetails: item.dataValues.PetitStockSaleDetails,
    petitStock: item.PetitStock.dataValues,
    user: item.User.dataValues,
  }));


  const filteredData = newArray.map(item => {
    const filteredProducts = item.petitStockSaleDetails.map(detail => {
      const filteredPackages = detail.toJSON().Package.Products.find(product => {
        return product.id == detail.toJSON().productId;
      });
      return {
        ...(detail.toJSON()),
        Package: {
          ...detail.toJSON().Package,
          Products: filteredPackages,
        },
      };
    });
    return {
      ...item,
      petitStockSaleDetails: filteredProducts,
    };
  });

  return res
    .status(200)
    .json({ status: "success", data: filteredData, message: "All sales" });
});

const approve = asyncWrapper( async (req , res) => {
  if( !req.body.id){
    return res.status(400).json({ status: 'error', message: 'Id is required'})
  }

  const petitSales = await PetitStockSale.findByPk(req.body.id)

  if(!petitSales) {
    return res.status.json( { status: 'error', message: "There is no sales related to Id" } )
  }

  petitSales.set({ status : 'COMFIRMED'})
  await petitSales.save()

  return res.status(200).json( { status:'success', message: "succesffuly confirmed"  })

})
export default {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  GetAllProducts,
  GetProductById,
  sell,
  allSalles,
};
