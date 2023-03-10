import { Item } from "../models";

const CreateItem = async (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ status: "error", message: "Name is required" });
  }
  const newItem = await Item.create(req.body);
  return res.status(201).json({ status: "ok", data: newItem });
};

const UpdateItem = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ status: "error", message: "Id is required" });
  }
  const item = await Item.findByPk(req.body.id, req.body);
  if (!item) {
    return res.status(404).json({ status: "error", message: "Item not found" });
  }

  item.set(req.body);
  item.save();

  return res.status(200).json({ status: "ok", data: item });
};

const DeleteItem = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ status: "error", message: "Id is required" });
  }

  const item = await Item.findByPk(req.params.id);
  if (!item)
    return res.status(404).json({ status: "error", message: "Item not found" });

  await item.destroy();
  return res.status(200).json({ status: "ok", message: "Item deleted" });
};

export { CreateItem, UpdateItem, DeleteItem };
