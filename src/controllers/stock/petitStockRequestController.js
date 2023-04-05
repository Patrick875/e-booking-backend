import {
  PetitStock,
  PetitStockItem,
  PetitStockRequesitionDetail,
  PetitStockRequesition,
} from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const create = asyncWrapper(async (req, res) => {
  if (!req.body?.petitStock) {

  }

  const total = req.body.data.reduce((accum, curr) => {
    return accum + curr;
  }, 0);

  let petit_stock = await PetitStock.findOne({ where: {name : req.body.petitStock} });

  if(! (petit_stock)){
    petit_stock = await PetitStock.create( { name : req.body.petitStock})
  }

  const request = await PetitStockRequesition.create({
    userId: req.user.id,
    total,
    petitStock: petit_stock.id
  });

  if (request) {
    
    for (let element in request.body.data) {
      await PetitStockRequesitionDetail.create({
        itemValueId: element.itemValueId,
        quantity: element.quantity,
        petitStockrequestId: request.id,
      });

    //   let item = await 
    //   if(await PetitStockItem.findByPk( ) )

    }
  }
});
