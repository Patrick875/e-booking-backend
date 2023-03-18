import { Hall, HallService } from "../models";

const CreateHallService = async (req, res) => {
  if (!req.body?.name || !req.body?.price) {
    return res
      .status(400)
      .json({ status: `error`, message: `name and price are required` });
  }
  try {
    const hall = await Hall.create(req.body);
    return res.status(200).json({ status: `success`, data: hall });
  } catch (err) {
    return res.status(500).json({ status: `error`, message: err.message });
  }
};

const UpdateHallService = async (req, res) => {
  if (!req.body?.id) {
    return res
      .status(400)
      .json({ status: `error`, message: ` id is required` });
  }
  const services = await HallService.findByPk(req.body.id);

  if (!services) {
    return res.status(400).json({
      status: `error`,
      message: ` Hall Service with id ${req.body.id} not found`,
    });
  }

  services.set(req.body);
  try {
    await services.save();

    return res.status(200).json({ status: `ok`, data: services });
  } catch (error) {
    return res.status(500).json({ status: `error`, message: error.message });
  }
};

const DeleteHallService = async (req, res) => {
  if (!req.body?.id) {
    return res
      .status(400)
      .json({ status: `error`, message: ` id is required` });
  }

  const services = await HallService.findByPk(req.body.id);

  if (!services) {
    return res.status(400).json({
      status: `error`,
      message: ` Hall Service with id ${req.body.id} not found`,
    });
  }

  try {
    await services.destroy();
  } catch (error) {
    return res.status(500).json({ status: `error`, message: error.message });
  }

  return res.status(200).json({
    status: `ok`,
    message: ` Hall Service with id ${req.body.id} deleted`,
  });
};

const GetAllService = async (req, res) => {
  const hallServices = await HallService.findAll({ include: [Hall] });
  return res.status(200).json({ status: `ok`, data: hallServices });
};

export default {
  CreateHallService,
  UpdateHallService,
  DeleteHallService,
  GetAllService,
};
