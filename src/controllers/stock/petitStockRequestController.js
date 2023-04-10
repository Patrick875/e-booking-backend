import {
  PetitStock,
  PetitStockItem,
  StockItem,
  StockItemValue,
  PetitStockRequesitionDetail,
  PetitStockRequesition,
} from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const create = asyncWrapper(async (req, res) => {
  const { data } = req.body;

  if (!data[0].petitStock) {
    return res
      .status(400)
      .json({ status: "error", message: "petit stock is requried " });
  }

  let total = 0;

  for (let dataElement of data) {
    let item = await StockItemValue.findByPk(dataElement.itemValueId, {
      include: [{ model: StockItem }],
    });

    if (!item) {
      return res.status(404).json({
        status: "error",
        message: `Error the stock Item related to ${dataElement.itemValueId} does not exist`,
      });
    }
    total = total + item.price * item.quantity;
  }


      
  let petit_stock = await PetitStock.findOne({
    where: { name: req.body.data[0].petitStock },
  });

  if (!petit_stock) {
    petit_stock = await PetitStock.create({
      name: req.body.data[0].petitStock,
    });
  }

  const request = await PetitStockRequesition.create({
    userId: req?.user?.id ? req.user.id : 1,
    total,
    petitStockId: petit_stock.id,
  });
  
  for (let element of data) {


    await PetitStockRequesitionDetail.create({
      itemValueId: element.itemValueId,
      quantity: element.quantity,
      petitStockrequestId: request.id,
    });

    let item = await StockItemValue.findByPk(element.itemValueId, {
      include: [{ model: StockItem }],
    });

    const petitStockItem = await PetitStockItem.findOne({
      where: {
        itemId: item.toJSON().StockItem.id,
        petitstockId: petit_stock.id,
      },
    });
    if (petitStockItem) {
      petitStockItem.set({
        quantity: petitStockItem.quantity + element.quantity,
        avgPrice: element.quantity * item.price,
      });
      await petitStockItem.save();
    } else {
      await PetitStockItem.create({
        quantity: element.quantity,
        itemId: item.StockItem.id,
        petitstockId: petit_stock.id,
        avgPrice: element.quantity * item.price,
      });
    }
  }
  return res
    .status(200)
    .json({ status: "success", message: " Successfull Request Order sent " });
});

const index = asyncWrapper(async (req, res) => {
  const data = await PetitStockRequesition.findAll({
    include: [
      {
        model: PetitStockRequesitionDetail,
        include: [
          {
            model: StockItemValue,
            include: { model : StockItem, 
              attributes: { exclude: ['createdAt', 'updatedAt']}
            },
            attributes: { exclude: ["createdAt", "updatedAt", "petitStockrequestId"] },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },

  });

  return res.status(200).json({ status: "success", data });
});

export default { create, index };
