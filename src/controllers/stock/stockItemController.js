import {
  StockItem,
  StockItemValue,
  StockPurchaseOrder,
  StockPurchaseOrderDetail,
  StockReceiveVoucherDetail,
  User,
  PetitStock,
  PetitStockRequesition,
  PetitStockRequesitionDetail,
} from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const CreateItem = asyncWrapper(async (req, res) => {
  const name = req.body.name;
  if (!req.body.name)
    return res.status(400).json({ message: "Name is required" });

  if (await StockItem.findOne({ where: { name } })) {
    return res
      .status(409)
      .json({ status: "error", message: `${name} is already saved` });
  }

  const stock_item = await StockItem.create(req.body);
  return res
    .status(201)
    .json({ status: `ok`, message: "Item created", data: stock_item });
});

const GetItem = asyncWrapper(async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({
      status: `error`,
      message: "Item Id required and should be a number ",
    });
  const item = await StockItem.findByPk(req.params.id);
  if (!item) {
    return res.status(404).json({ status: "error", message: "Item not found" });
  }
  return res.status(200).json({ status: "success", data: item });
});

const GetItems = asyncWrapper(async (req, res) => {
  const items = await StockItem.findAll({
    include: [
      {
        model: StockItemValue,
        attributes: { exclude: ["createdAt", "updatedAt", "stockItemId"] },
      },
    ],
    order: [["id", "DESC"]],
  });
  return res.status(200).json({ status: "ok", data: items });
});

const UpdateItem = asyncWrapper(async (req, res) => {
  if (!req.body.id) return res.status(400).json({ message: "id is required " });

  const stock_item = await StockItem.findByPk(req.body.id);

  if (!stock_item)
    return res.status(404).json({ message: "stock item not found " });

  stock_item.set(req.body);
  stock_item.save();
  return res.status(200).json({
    status: `ok`,
    message: " Stock Item updated successfully",
    data: stock_item,
  });
});

const DeleteItem = asyncWrapper(async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ message: "id is required " });
  const stock_item = await StockItem.findByPk(req.params.id);
  if (!stock_item) return res.status(404).json({ message: " Item not found" });
  await stock_item.destroy();
  return res
    .status(200)
    .json({ status: `ok`, message: " Item deleted successfully" });
});

const stockBalance = asyncWrapper(async (req, res) => {
  const data = await StockItemValue.findAll({
    include: [
      { model: StockItem, attributes: { exclude: ["createdAt", "updatedAt"] } },
    ],
    attributes: { exclude: ["createdAt", "updatedAt", "stockItemId"] },
  });

  return res
    .status(200)
    .json({ status: "success", message: "stock balance", data });
});

const trackItemTransaction = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .json({ status: "error", message: "Stock Item is required" });
  }
  const stockItem = await StockItem.findByPk(id);

  if (!stockItem) {
    return res
      .status(404)
      .json({ status: "error", message: "No Stock Item found" });
  }
  //   const itemTrack = await StockPurchaseOrder.findAll({ include : [{
  //     model : StockPurchaseOrderDetail,
  //     where : { id : id },
  //     include : [{
  //       model : StockItem,
  //       attributes: { exclude: ["createdAt", "updatedAt"] },
  //     }],
  //     attributes: { exclude : ['stockPurchaseOrderId', 'createdAt', 'updatedAt']},

  //   }],
  //   order: [['date', 'DESC']],
  // })

  const itemTrack = await StockItemValue.findAll({
    include: [
      {
        model: StockItem,
        where: { id },
      },
      // { model: StockReceiveVoucherDetail },
      {
        model: PetitStockRequesitionDetail,
        include: [
          {
            model: PetitStockRequesition,
            include: {
              model: PetitStock,
              attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
            },
            include: [
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
            attributes: { exclude: ["createdAt", "updatedAt", "petitStockId"] },
          },
        ],
        attributes: { exclude: ["createdAt", "petitStockrequestId"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },

  });

  return res.status(200).json({ status: "success", data: itemTrack });
});
export default {
  CreateItem,
  GetItem,
  GetItems,
  UpdateItem,
  DeleteItem,
  stockBalance,
  trackItemTransaction,
};
