import { Room, RoomClass, Reservation, Customer } from "../../models";
import { asyncWrapper } from '../../utils/handlingTryCatchBlocks'

const getAllRoom = asyncWrapper(async (req, res) => {
  let data = await Room.findAll({
    include: [
      { model: RoomClass, attributes: { exclude: ["createdAt", "updatedAt"] } },
      {
        model: Reservation,
        include : [{
          model: Customer,
          attributes: { exclude: ["createdAt", "updatedAt"] },

        }],
        attributes: { exclude: ["createdAt", "updatedAt"] },
        order: [['dueDate', 'ASC']],
        onAfterFind: (tasks,options) => {
          
        }
      },
      
    ],
    attributes: { exclude: ["createdAt", "updatedAt","roomClassId"] },
  });

  // let newdata = data.map((item, index, arrayColl) => {

  //   arrayColl['book_date'] = item.Reservations
  //   return ;
  //   return {...item, book_date: { checkIn : item.Reservations.checkIn, checkOut : item.Reservations.checkOut }}
  // })

  res.status(200).json({ message: "ok", data });
});

const getRoom = asyncWrapper(async (req, res) => {

  if(!req.params.id){
    return res.status(404).json({status: 'error', message: 'Id is required'});
  }

  if(isNaN(req.params.id)){

    return res.status(400).json({ status: "error", message : "Invalid id" });
  }

  if (!req.params.id) return res.status(400).json({ message: "bad request" });

  const data = await Room.findByPk(req.params.id,{

    attributes: { exclude: ["createdAt", "updatedAt", "roomClassId"] },
    include: [
      {
        model: Reservation,
        attributes: ["checkIn", "checkOut"],
        order: [['dueDate', 'ASC']],
        where: {
          
        },
        onAfterFind: (tasks,options) => {
          
        }
      },
      
    ]});
  if (!data) {
    return res
      .status(204)
      .json({ message: `Room class with id does not exist`, data });
  }
  res.status(200).json({ message: "ok", data });
});

const createRoom = asyncWrapper(async (req, res) => {
  if (!req.body.name || !req.body.roomClassId) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }

  if(await Room.findOne({where : { name : req.body.name }})){
    return res.status(409).json({status: `error`, message: `Room ${req.body.name} already  exists`});
  }

  const roomClass = await RoomClass.findByPk(req.body.roomClassId);
  if (!roomClass) {
    return res.status(400).json({ message: "Room class does not exist" });
  }

  req.body["status"] = "active";

  const data = await Room.create(req.body);
  return res.status(201).json({ message: "ok", data });
});

const deleteRoom = asyncWrapper(async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ status: "error", message: "bad request" });

  const room = await Room.findByPk(req.params.id);

  if (!room)
    return res
      .status(400)
      .json({ status: "error", message: "Room does not exist" });

  await room.destroy();
  return res
    .status(200)
    .json({ status: "ok", message: "Room deleted successfully" });
});

const updateRoom = asyncWrapper(async (req, res) => {
  if (!req.body.id)
    return res.status(400).json({ status: "error", message: "bad request" });

  const room = await Room.findByPk(req.body.id);

  if (!room)
    return res
      .status(400)
      .json({ status: "error", message: "Room does not exist" });

  room.set(req.body);
  await room.save();

  return res
    .status(200)
    .json({ status: "ok", message: "Room updated successfully" });
});

export default {
  getAllRoom,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
