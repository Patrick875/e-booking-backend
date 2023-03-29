import {
  StockPurchaseOrder,
  StockItemValue,
  StockPurchaseOrderDetail,
  StockItem
} from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const create = asyncWrapper(async (req, res) => {
  console.log(req.body.order);
  if (!req.body?.order || typeof req.body.order !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Tatal is required and should be an array",
    });
  }

  let total = req.body.order.reduce((acc, curr) => {
    return acc + curr.price;
  }, 0);

  const pOrder = await StockPurchaseOrder.create({
    date: new Date(),
    userId: 1,
    total,
  });

  if (pOrder) {
    for (let element of req.body.order) {
      let itemValue = await StockItemValue.findOne({
        where: { price: element.price, stockItemId: element.id },
      });

      if (!itemValue) {
        itemValue = await StockItemValue.create({
          quantity: element.quantity,
          price: element.price,
          stockItemId: element.id,
        });
      }

      let stockDetail = await StockPurchaseOrderDetail.create({
        stockItemId: element.id,
        stockPurchaseOrderId: pOrder.id,
        currentQuantity: itemValue.quantity,
        requestQuantity: element.quantity,
        unitPrice: element.price,
      });

      console.log(stockDetail);
    }
  }

  return res
    .status(201)
    .json({ status: "ok", message: "Successifully Purchase Order added " });
});

const index = asyncWrapper(async (req, res) => {
  const data = await StockPurchaseOrder.findAll({
    include: [
      {
        model: StockPurchaseOrderDetail,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: StockItem,
            attributes: { exclude : ["createdAt", "updatedAt"] },
    
          }
        ]
      }
    ],
  });

  return res
    .status(200)
    .json({ status: "ok", message: "Purchase order  retrieved", data });
});
export default { create, index };
