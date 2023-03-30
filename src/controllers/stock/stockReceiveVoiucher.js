import {
    StockPurchaseOrder,
    StockItem
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

    for( let element in req.body.data ) {
        
        }

})