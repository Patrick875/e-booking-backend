import { RoomClass } from "../models";

const getAllRoomClasses = async (req, res) => {
  const data = await RoomClass.findAll({});
  res.status(200).json({ message: "ok", data });
};

const getRoomClass = async (req, res) => {
  const data = await RoomClass.findByPk(req.params.id);
  if (!data) {
    return res
      .status(204)
      .json({ message: `Room class with id does not exist` });
  }
  res.status(200).json({ message: "ok", data });
};

const createRoomClass = async (req, res) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }

  req.body["status"] = "active";

  const data = await RoomClass.create(req.body);
  return res.status(201).json({ message: "ok", data });
};

export default {
  getAllRoomClasses,
  getRoomClass,
  createRoomClass,
};
