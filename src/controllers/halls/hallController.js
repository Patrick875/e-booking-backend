import { Hall, Reservation, HallService } from "../../models";
import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";

const CreateHall = asyncWrapper(async (req, res) => {
  if (!req?.body.name || !req?.body.price || !req?.body.size) {
    return res.status(400).json({
      status: `error`,
      message: "Hall name, size (capacity) and price required",
    });
  }

  if (await Hall.findOne({ where: { name: req.body.name } })) {
    return res
      .status(409)
      .json({
        status: `error`,
        message: `Room ${req.body.name} already  exists`,
      });
  }

  const hall = await Hall.create(req.body);
  return res
    .status(201)
    .json({ status: "ok", message: "hall created succefully", data: hall });
});

const UpdateHall = asyncWrapper(async (req, res) => {
  if (!req.body.id) {
    return res
      .status(400)
      .json({ status: `error`, message: "Hall id is required" });
  }

  Hall.set(req.body);
  await Hall.save();
  return res
    .status(200)
    .json({ status: "ok", message: "hall Updated successfully" });
});

const DeleteHall = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ status: `error`, message: "Hall id is required" });
  }
});

const SingleHall = asyncWrapper(async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ status: `error`, message: "Hall id is required " });
  }

  if (isNaN(req.params.id)) {
    return res
      .status(400)
      .json({ status: `error`, message: "Id should be a number" });
  }

  const hall = await Hall.findByPk(req.params.id, {
    include: [
      {
        model: Reservation,
        attributes: ["checkIn", "checkOut"],
        onAfterFind: (tasks, options) => {},
      },
      {
        model: HallService,
      },
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  return res.status(200).json({ status: `ok`, data: hall });
});

const AllHalls = asyncWrapper(async (req, res) => {
  const halls = await Hall.findAll({ include: [Reservation] });
  return res.status(200).json({
    status: "ok",
    message: "All halls fetched successfully",
    data: halls,
  });
});

export default { CreateHall, UpdateHall, DeleteHall, AllHalls, SingleHall };
