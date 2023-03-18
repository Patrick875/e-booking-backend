import { Reservation, Customer, Room, Hall, User } from "../models";

const AllReservations = async (req, res) => {
  const data = await Reservation.findAll({
    include: [Customer, Room, Hall, User],
  });

  return res.status(200).json({ status: "ok", data });
};

const CreateReservation = async (req, res) => {
  const validationArr = ["checkIn", "checkOut", "booking_type", "customerId"];
  let errors;
  let is_valid = true;

  validationArr.forEach((item) => {
    if (!req.body[item]) {
      errors += item;
    }
  });

  if (!is_valid) {
    return res.status(400).json({ error: `${errors} are required` });
  }

  if (!req.body.roomId && !req.body.hallId) {
    return res
      .status(400)
      .json({ error: "roomId and hallId can't both be empty" });
  }

  if (req.body?.roomId) {
    const room = await Room.findByPk(req.body.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
  }
  if (req.body?.hallId) {
    const hall = await Hall.findByPk(req.body.hallId);
    if (!hall) {
      return res.status(404).json({ error: "Hall not found" });
    }
  }

  try {
    const reservation = await Reservation.create(req.body);

    const data = await Reservation.findByPk(reservation.id, {
      include: [Customer, Room, Hall, User],
    });

    return res.status(201).json({ status: "ok", data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const GetReservation = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ error: "id is required" });

  const reservation = await Reservation.findByPk(req.params.id, {
    include: Customer,
  });

  if (!reservation)
    return res.status(404).json({
      status: "error",
      message: "Reservation not with this id not found",
    });

  return res.status(200).json({ status: "ok", data: reservation });
};

const UpdateReservation = async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ status: "error", message: "id is required" });
  const reservation = await Reservation.findByPk(req.params.id);

  if (!reservation)
    return res
      .status(404)
      .json({ status: "error", message: "Reservation not found" });

  reservation.set(req.body);
  await reservation.save();

  return res.status(200).json({ status: "ok", data: reservation });
};

const ChechOutReservation = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ error: "id is required" });

  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation)
    return res
      .status(404)
      .json({ status: "error", message: "Reservation not found" });

  reservation.update({ status: "out" });

  return res.status(200).json({ status: "ok", data: reservation });
};

export default {
  AllReservations,
  CreateReservation,
  UpdateReservation,
  ChechOutReservation,
  GetReservation,
};
