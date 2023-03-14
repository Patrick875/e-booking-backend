import { StockItem } from "../models";

const CreateItem = async (req, res) => {
  if (!req.body.name)
    return res.status(400).json({ message: "Name is required" });

  const stock_item = await StockItem.create(req.body);
  return res
    .status(201)
    .json({ status: `ok`, message: "Item created", data: stock_item });
};

const GetItem = async (req, res) => {};

const GetItems = async (req, res) => {
    const items = await StockItem.findAll({order: [["id", "DESC"]]});
    return res.status(200).json({ status: "ok", data:items});

};

const UpdateItem = async (req, res) => {
  if (!req.body.id) return res.status(400).json({ message: "id is required " });

  const stock_item = await StockItem.findByPk(req.body.id);

  if (!stock_item)
    return res.status(404).json({ message: "stock item not found " });

  stock_item.set(req.body);
  stock_item.save();
  return res
    .status(200)
    .json({ status: `ok`, message: " Stock Item updated successfully" });
};

const DeleteItem = async (req, res) => {
    if(!req.body.id) return res.status(400).json({ message: "id is required " });
    const stock_item = StockItem.findByPk(req.body.id);
    if(!stock_item) return res.status(404).json({ message: " Item not found"});
    await stock_item.destroy();
    return res.status(200).json({ status: `ok`, message: " Item deleted successfully" });
}

export default { CreateItem, GetItem, GetItems,UpdateItem, DeleteItem };