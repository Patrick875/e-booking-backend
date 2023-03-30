import {
    StockPurchaseOrder,
    StockItem,
    StockItemValue,
    StockReceiveVoucher,
    StockReceiveVoucherDetail
  } from "../../models";
  import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

//   date: DataTypes.DATE,
//   status: DataTypes.STRING,
//   userId: DataTypes.INTEGER,
//   total: DataTypes.INTEGER,
//   stockPurchaseOrderId: DataTypes.INTEGER
const create = asyncWrapper( async (req , res) => {

    if(!req.body?.data || typeof req.body?.data != 'object') {
        return res.status(400).json({status: 'error', message: 'the request should be a JSON object and have property named data'});
    }
      let total = req.body.data.reduce((acc, curr) => {
        return acc + curr.price;
      }, 0);

      const { data, stockPurchaseOrderId } = req.body;
    
      const reveiveVoucher = await StockReceiveVoucher.create({
        date: new Date(),
        userId: 1,
        stockPurchaseOrderId : stockPurchaseOrderId,
        total,
      });
    
  if (reveiveVoucher) {
    for (let element of data) {

      console.log(element, data);

      let itemValue = await StockItemValue.findOne({
        where: { price: element.price, stockItemId: element.item_id },
      });

      if (!itemValue) {
        itemValue = await StockItemValue.create({
          quantity: element.quantity,
          price: element.price,
          stockItemId: element.item_id,
        });
      }

      let stockDetail = await StockReceiveVoucherDetail.create({
        stockItemId: element.item_id,
        stockReceiveVoucherId: reveiveVoucher.id,
        receivedQuantity: element.quantity,
        unitPrice: element.price,
      });

    }
    
  }

  return res
  .status(201)
  .json({ status: "ok", message: "Successifully Receive Voucher added " });


})

const index = asyncWrapper( async(req, res) => {
  const data = await StockReceiveVoucher.findAll({include: [{
    model: StockPurchaseOrder,
    attributes: { exclude : ['createdAt', 'updatedAt'] }

  },
{
  model: StockReceiveVoucherDetail,
  include: [{
    model: StockItem,
    attributes: { exclude : ['createdAt', 'updatedAt'] }

  }],
  attributes: { exclude : ['createdAt', 'updatedAt'] }
}]})
} )

export default { create, index } 