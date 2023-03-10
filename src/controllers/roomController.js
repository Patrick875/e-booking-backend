import { Room } from "../models";
import { RoomClass } from "../models";

const getAllRoom = async (req, res) => {
  const data = await Room.findAll({ include: RoomClass });
  res.status(200).json({ message: "ok", data });
};

const getRoom = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ message: "bad request" });

  const data = await Room.findByPk(req.params.id);
  if (!data) {
    return res
      .status(204)
      .json({ message: `Room class with id does not exist`, data});
  }
  res.status(200).json({ message: "ok", data });
};

const createRoom = async (req, res) => {
  if (!req.body.name || !req.body.roomClassId) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }

  const roomClass = await RoomClass.findByPk(req.body.roomClassId);
  if (!roomClass) {
    return res.status(400).json({ message: "Room class does not exist" });
  }

  req.body["status"] = "active";

  const data = await Room.create(req.body);
  return res.status(201).json({ message: "ok", data });
};

export default {
  getAllRoom,
  getRoom,
  createRoom,
};
