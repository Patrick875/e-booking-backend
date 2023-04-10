import {
  StockPurchaseOrder,
  StockItemValue,
  StockPurchaseOrderDetail,
  StockItem
} from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const create = asyncWrapper(async (req, res) => {

  if (!req.body?.order || typeof req.body.order !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Order Required and should be an Object",
    });
  }

  let total = req.body.order.reduce((acc, curr) => {
    return acc + curr.price;
  }, 0);
  const user = req.user

  console.log(user)

  const pOrder = await StockPurchaseOrder.create({
    date: new Date(),
    userId: user.id,
    total,
  });

  if (pOrder) {
    for (let element of req.body.order) {
      let itemValue = await StockItemValue.findOne({
        where: { price: element.price, stockItemId: element.id },
      });

      let stockDetail = await StockPurchaseOrderDetail.create({
        stockItemId: element.id,
        stockPurchaseOrderId: pOrder.id,
        currentQuantity:itemValue ?  itemValue.quantity : 0,
        requestQuantity: element.quantity,
        unitPrice: element.price,

      });

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
        attributes: { exclude: ["createdAt", "updatedAt", "stockPurchaseOrderId", "stockItemId"] },
        include: [
          {
            model: StockItem,
            attributes: { exclude : ["createdAt", "updatedAt"] },
    
          }
        ]
      }
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },

  });

  return res
    .status(200)
    .json({ status: "ok", message: "Purchase order  retrieved", data });
});

const show = asyncWrapper( async (req, res) => {
  if(!req.params?.id || isNaN(req.params?.id)) return res.status(400).json({staus: 'error', message: 'Invalid id'});

  const row = await StockPurchaseOrder.findByPk(req.params.id,{
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
  })

  return res.status(200).json({status: 'success' , message: 'Successfull retrieval', data: data})

})

const update = asyncWrapper ( async (req, res) => {

  console.log(req.body)
  
} ) 
export default { create, index , show, update};
