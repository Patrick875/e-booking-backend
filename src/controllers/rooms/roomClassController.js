import { RoomClass } from "../../models";
import { asyncWrapper } from '../../utils/handlingTryCatchBlocks'

const getAllRoomClasses = asyncWrapper(async (req, res) => {
  const data = await RoomClass.findAll({});
  res.status(200).json({ message: "ok", data });
});

const getRoomClass = asyncWrapper (async (req, res) => {
  if(!req.params.id) return res.status(400).json({ message: "Bad Request" });

  const data = await RoomClass.findByPk(req.params.id);
  if (!data) {
    return res
      .status(204)
      .json({ message: `Room class with id does not exist` });
  }
  res.status(200).json({ message: "ok", data });
});

const createRoomClass = asyncWrapper(async (req, res) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }

  if(await RoomClass.findOne({ where : {name : req.body.name} }))
  {
    return res.status.json({status : 'error', message : `Room  ${req.body.name} already exists`})
  }
  req.body["status"] = "active";

  const data = await RoomClass.create(req.body);
  return res.status(201).json({ message: "ok", data });
});

const updateRoomClass = asyncWrapper(async (req, res) => {

if(!req.body.id) return res.status(400).json({ message: "Bad Request Id not provided" });

const roomClass = await RoomClass.findByPk(req.body.id);
if(!roomClass) {
  return res.status(204).json({ message: `Room class with id  ${req.body.id} does not found` });
}

roomClass.set(req.body);
roomClass.save();

return res.status(200).json({ message: "ok", data: roomClass});
})

const deleteRoomClass = asyncWrapper(async (req, res) => {
  const roomClass = await RoomClass.findByPk(req.params.id);
  if(!roomClass) {
    return res.status(204).json({ message: `Room class with id  ${req.params.id} not found` });
  }
  await roomClass.destroy();

  return res.status(204).json({ message: "ok" });
})

export default {
  getAllRoomClasses,
  getRoomClass,
  createRoomClass,
  updateRoomClass,
  deleteRoomClass
};
