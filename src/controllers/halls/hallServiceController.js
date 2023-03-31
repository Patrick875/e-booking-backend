import { Reservation, HallService } from "../../models";
import { asyncWrapper } from '../../utils/handlingTryCatchBlocks'

const CreateHallService = asyncWrapper (async (req, res) => {
  if (!req.body?.name || !req.body?.price) {
    return res
      .status(400)
      .json({ status: `error`, message: `name and price are required` });
  }
  if (await HallService.findOne({ where: { name: req.body.name } })) {
    return res
      .status(409)
      .json({
        status: `error`,
        message: `Room ${req.body.name} already  exists`,
      });
  }
    const hall = await HallService.create(req.body);
    return res.status(200).json({ status: `ok`, data: hall });

});

const UpdateHallService = asyncWrapper( async (req, res) => {
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

    await services.save();

    return res.status(200).json({ status: `ok`, data: services });

});

const DeleteHallService = asyncWrapper( async (req, res) => {
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


    await services.destroy();


  return res.status(200).json({
    status: `ok`,
    message: ` Hall Service with id ${req.body.id} deleted`,
  });
});

const GetAllService = asyncWrapper(async (req, res) => {

    const hallServices = await HallService.findAll({
      include: [{model : Reservation, attributes: {exclude: ['createdAt', 'updatedAt']}}],
      attributes: {exclude: ['createdAt', 'updatedAt']}
    });
    return res.status(200).json({ status: `ok`, data: hallServices });

});

export default {
  CreateHallService,
  UpdateHallService,
  DeleteHallService,
  GetAllService,
};
