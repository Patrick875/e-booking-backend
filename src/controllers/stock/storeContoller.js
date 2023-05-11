import {
  Store,
  StockItemNew,
  StockItemValue,
  StockItemTransaction,
} from "../../models";
import { Op } from "sequelize";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const create = asyncWrapper(async (req, res) => {
  const name = req.body.name;
  if (!req.body.name)
    return res.status(400).json({ message: "Name is required" });

  if (await Store.findOne({ where: { name } })) {
    return res
      .status(409)
      .json({ status: "error", message: `${name} is already saved` });
  }

  const store = await Store.create(req.body);
  return res
    .status(201)
    .json({ status: `ok`, message: "Item created", data: store });
});

const show = asyncWrapper(async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({
      status: `error`,
      message: "Stre Id required and should be a number ",
    });
  const store = await Store.findByPk(req.params.id, {
    include: [{
      model: StockItemNew,
      include: [{
        model: StockItemValue
      }]
    }]
  });
  if (!store) {
    return res.status(404).json({ status: "error", message: "Item not found" });
  }
  return res.status(200).json({ status: "success", data: store });
});

const index = asyncWrapper(async (req, res) => {
  const items = await Store.findAll({
    include: [
      {
        model: StockItemNew,
        include: [
          {
            model: StockItemValue,
            attributes: { exclude: ["updatedAt", "stockItemId"] },
          },
        ],
        attributes: { exclude: [ "updatedAt", "stockItemId"] },
      },
    ],
    order: [["id", "DESC"]],
  });
  return res.status(200).json({ status: "ok", data: items });
});

const update = asyncWrapper(async (req, res) => {
  if (!req.body.id) return res.status(400).json({ message: "id is required " });

  const store = await Store.findByPk(req.body.id);

  if (!store)
    return res.status(404).json({ message: "stock item not found " });

  store.set(req.body);
  store.save();
  return res.status(200).json({
    status: `ok`,
    message: " Store updated successfully",
    data: store,
  });
});

const destroy = asyncWrapper(async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ message: "id is required " });
  const store = await Store.findByPk(req.params.id);
  if (!store) return res.status(404).json({ message: " Store not found" });
  await store.destroy();
  return res
    .status(200)
    .json({ status: `ok`, message: " Store deleted successfully" });
});

const trackItemTransaction = asyncWrapper( async (req, res) => {

  const { item, date_from, date_to } = req.query;
  if(item) {
    const row = await Store.findByPk(item);
    if(!row) return res.status(404).json({ status: 'error', message: 'stock item not found' });
  }

  let itemTransaction

  if ((item && date_from && date_to)) {

     itemTransaction = await StockItemTransaction.findAll({
      include : [ {model : StockItemNew, 
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
      include : [ {model : StockItemNew, 
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
      include : [ {model : StockItemNew, 
      attributes: { exclude : ['updatedAt'] } } ],
      where: {
        stockItem : item
      },
    });
   }
   else{
    itemTransaction = await StockItemTransaction.findAll({
      include : [ {model : StockItemNew, 
      attributes: { exclude : ['updatedAt'] } } ],
    });
   }


  return res.status(200).json({ status: "success", data: itemTransaction });
});


export default {
  create,
  show,
  index,
  update,
  destroy,
  trackItemTransaction,
};
