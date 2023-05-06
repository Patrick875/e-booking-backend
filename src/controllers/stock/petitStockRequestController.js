import {
  PetitStock,
  PetitStockItem,
  StockItem,
  StockItemValue,
  PetitStockRequesitionDetail,
  PetitStockRequesition,
  User
} from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
import generateId from '../../utils/generateChonologicId';

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
    total = total + Number(item.price * dataElement.quantity);
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
    stockRequesitionId: `PS${await generateId(PetitStockRequesition)}`,

  });

  for (let element of data) {
    await PetitStockRequesitionDetail.create({
      itemValueId: element.itemValueId,
      quantity: element.quantity,
      petitStockrequestId: request.id,
    });
  }

  const petitStockRequest = await PetitStockRequesition.findByPk(request.id, {
    include: {
      model: PetitStockRequesitionDetail,
      include: {
        model: StockItemValue,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    },
  });

  return res.status(200).json({
    status: "success",
    message: " Successfull Request Order sent ",
    data: petitStockRequest,
  });
});

const index = asyncWrapper(async (req, res) => {
  const data = await PetitStockRequesition.findAll({
    include: [
      {
        model: PetitStockRequesitionDetail,
        include: [
          {
            model: StockItemValue,
            include: {
              model: StockItem,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt", "petitStockrequestId"],
            },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      {
        model: User,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "refreshToken",
            "password",
            "verifiedAT",
          ],
        },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  return res.status(200).json({ status: "success", data });
});

const approve = asyncWrapper(async (req, res) => {
  const { request } = req.body;
  if (!request)
    return res.status(404).json({
      status: "error",
      message: "The request is required",
    });

  let petitStock = await PetitStockRequesition.findByPk(request, {
    include: [
      {
        model: PetitStockRequesitionDetail,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  if (!petitStock)
    return res.status(404).json({
      status: "error",
      message: "The request related to this Id not found",
    });

  petitStock = petitStock.toJSON();

  for (let element of petitStock.PetitStockRequesitionDetails) {
    let item = await StockItemValue.findByPk(element.itemValueId, {
      include: [{ model: StockItem }],
    });

    const petitStockItem = await PetitStockItem.findOne({
      where: {
        itemId: item.toJSON().StockItem.id,
        petitstockId: petitStock.petitStockId,
      },
    });

    if (petitStockItem) {

      petitStockItem.set({
        quantinty:
          Number(
            !petitStockItem.toJSON().quantinty
              ? petitStockItem.toJSON().quantinty
              : 0
          ) + Number(element.quantity),
        avgPrice: Number(element.quantity) * Number(item.price),
      });
      await petitStockItem.save();
    } else {
      
      await PetitStockItem.create({
        quantinty: Number(element.quantity),
        itemId: item.StockItem.id,
        petitstockId: petitStock.petitStockId,
        avgPrice: Number(element.quantity) * Number(item.price),
      });
    }



    let stockItem =  await StockItemValue.findByPk(element.id);
    
    
    if(stockItem){
      stockItem.set({quantity : Number(stockItem.quantity) - Number(element.quantity)})
      await stockItem.save();
    }
  }

  await PetitStockRequesition.update(
    { status: "APPROVED" },
    { where: { id: request } }
  );

  return res
    .status(200)
    .json({ status: "OK", message: "Request approved", data: petitStock });
});

const show = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ status: "error", message: " Id is required" });
  }

  const data = await PetitStockRequesition.findByPk(req.params.id, {
    include: [
      {
        model: PetitStockRequesitionDetail,
        include: [
          {
            model: StockItemValue,
            include: {
              model: StockItem,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            attributes: {
              exclude: ["createdAt", "updatedAt", "petitStockrequestId"],
            },
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });

  return res.status(200).json({ status: "Ok", data });
});

const destroy = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ status: "error", message: "Id is required" });
  }

  const request = await PetitStockRequesition.findByPk(req.params.id);

  if (!request) {
    return res
      .status(200)
      .json({ status: "success", message: "Request not found" });
  }

  await request.destroy();
  return res
    .status(200)
    .json({ status: "success", message: "Request successfully destroyed" });
});


export default { create, index, approve, show, destroy };
