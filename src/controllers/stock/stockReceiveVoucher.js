import {
    StockPurchaseOrder,
    StockItem,
    StockItemValue,
    StockReceiveVoucher,
    StockReciveVoucherDetail
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
    for (let element of req.body.data) {

      let itemValue = await StockItemValue.findOne({
        where: { price: element.price, stockItemId: element.stockId },
      });

      if (!itemValue) {
        itemValue = await StockItemValue.create({
          quantity: element.quantity,
          price: element.price,
          stockItemId: element.itemId,
        });
      }

      let stockDetail = await StockReciveVoucherDetail.create({
        stockItemId: element.itemId,
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

export default { create } 