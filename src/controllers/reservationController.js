import { Reservation, Customer } from "../models";

const AllReservations = async (req, res) => {
    const data = await Reservation.findAll({include: [Customer]});

    if(data.length === 0){
        return res.status(404).json({message: 'No reservations found'});
    }
    return res.status(200).json({ status: "ok", data});
}

const CreateReservation = async (req, res) => {
  const {
    room,
    firstname,
    lastname,
    email,
    phone,
    booking_date,
    checkIn,
    checkOut,
    payment_mode,
    status,
  } = req.body;

  if (
    (!firstname && !lastname) ||
    !email ||
    !booking_date ||
    !checkIn ||
    !checkOut ||
    !room
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const customer = await Customer.create({ firstname, lastname, email, phone });
  const reservation = await Reservation.create({
    roomId: room,
    customerId: customer.id,
    booking_date,
    checkIn,
    checkOut,
    payment_mode,
    status,
  });

  const data = await Reservation.findByPk(reservation.id, {
    include: [{ model: Customer }],
  });

  return res.status(201).json({ status: "ok", data });
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

};

const ChechOutReservation = async (req, res) => {

    if(!req.params.id) return res.status(400).json({ error: "id is required" });

    const reservation = await Reservation.findByPk(req.params.id);
    if(!reservation) return res.status(404).json({ status: "error", message: "Reservation not found" });

    reservation.update({status : "out"});

    return res.status(200).json({ status: "ok", data: reservation });

}

export default {
    AllReservations,
    CreateReservation,
    UpdateReservation,
    ChechOutReservation,
    GetReservation,
}
