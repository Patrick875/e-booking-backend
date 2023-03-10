import { RoomClass } from "../models";
import { Room } from "../models";

const getAllRoomClasses = async (req, res) => {
  const data = await User.findAll({include: RoomClass});
  res.status(200).json({ message: "ok", data });
};

const getRoomClass = async (req, res) => {
  const data = await User.findByPk(req.params.id);
  if (!data) {
    return res
      .status(204)
      .json({ message: `Room class with id does not exist` });
  }
  res.status(200).json({message : "ok", data});
};

const createRoomClass = async (req, res) => {
  if (
    !req.body.name 
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }

  const data = await RoomClass.create(req.body);
  return res.status(201).json({ message: "ok", data });
};

export default {
  getAllRoomClasses,
  getRoomClass,
  createRoomClass,
};
