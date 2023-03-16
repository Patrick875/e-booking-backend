import {User, StockItem, StockTransactionDetail, StockTransaction } from '../models'

const createStockRequestOut = async (req, res, next) => {

    if(!req.body) {
        return res.status(400).json({status: `error`, message: `Invalid request body`})
    }

   const transaction =  await StockTransaction.create({userId: req.body.userId, status: 'STOCK_IN'})

    Object.keys(req.body).forEach(async (key, val) => {
        let transactionDetails = {};
        if (key.startsWith("item_")) {
          const item = await StockItem.findByPk(Number(key.split("_")[1]))

          if(item){
            transactionDetails.stockItemId = item.id;
            transactionDetails.stockTransactionId = transaction.id;
            transactionDetails.currentQuantity = item.quantity;
            transactionDetails.transactionQuantity = req.body[key];
            await StockTransactionDetail.create(transactionDetails);
          }
        }
      });

      return res.status(201).json({status: `success`, message: `Stock request out sent`})
}

const GetStockRequestOut = async (req, res, next) => {

    const requestOut = await StockTransaction.findAll({where: {status: 'STOCK_IN'},include:{model: [StockItem, StockTransactionDetail]}})

    return res.status(200).json({status: `ok`, message: `Stock request out`, data: requestOut});
}

export default {createStockRequestOut, GetStockRequestOut}