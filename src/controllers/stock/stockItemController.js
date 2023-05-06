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
  StockItemTransaction,
} from "../../models";
import { Op } from "sequelize";
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

const trackItemTransaction = asyncWrapper( async (req, res) => {

  const { item, date_from, date_to } = req.query;
  if(item) {
    const row = await StockItem.findByPk(item);
    if(!row) return res.status(404).json({ status: 'error', message: 'stock item not found' });
  }

  let itemTransaction

  if ((item && date_from && date_to)) {

     itemTransaction = await StockItemTransaction.findAll({
      include : [ {model : StockItem, 
      attributes: { exclude : ['updatedAt'] } } ],
      where: {
        stockItem: item,
        createdAt: {
          [Op.between]: [date_from, date_to],
        },
      },
    });
  }
  else if(date_from && date_to){
    itemTransaction = await StockItemTransaction.findAll({
      include : [ {model : StockItem, 
      attributes: { exclude : ['updatedAt'] } } ],
      where: {
        createdAt: {
          [Op.between]: [date_from, date_to],
        },
      },
    });
   }
   else if (item){
    itemTransaction = await StockItemTransaction.findAll({
      include : [ {model : StockItem, 
      attributes: { exclude : ['updatedAt'] } } ],
      where: {
        stockItem : item
      },
    });
   }
   else{
    itemTransaction = await StockItemTransaction.findAll({
      include : [ {model : StockItem, 
      attributes: { exclude : ['updatedAt'] } } ],
    });
   }


  return res.status(200).json({ status: "success", data: itemTransaction });
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
