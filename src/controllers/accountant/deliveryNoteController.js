import { DeliveryNote, DeliveryNoteDetail} from "../../models";
  import { asyncWrapper } from "../../utils/handlingTryCatchBlocks";
  import generateId from '../../utils/generateChonologicId';
  
  const create = asyncWrapper(async (req, res) => {
    const { data } = req.body;
  
    if (!data.details) {
      return res
        .status(400)
        .json({ status: "error", message: "The details is requried " });
    }

    let total = 0;
  

    for (let dataElement of data.details) {
      if (!dataElement.quantity || !dataElement.times ) {
        return res.status(404).json({
          status: "error",
          message: `Quantity and times are required`,
        });
      }
      total = total + Number(dataElement.unitPrice * dataElement.quantity);
    }
  
    const deliveryNote = await DeliveryNote.create({
      userId: req?.user?.id,
      company : data.company,
      date_from : data.date_from,
      date_to : data.date_to,
      total,
      status: 'PENDING',
      deliveryNoteId: `DN_${await generateId(DeliveryNote)}`,
  
    });

  
    for (let element of data.details ) {
      await DeliveryNoteDetail.create({
        description: element.description,
        times: element.times,
        unitPrice : element.quantinty,
        deliveryId: deliveryNote.id,
      });
    }

  
    const delivery = await DeliveryNote.findByPk(deliveryNote.id, {
      include: {
        model: DeliveryNoteDetail,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },

    });
  
    return res.status(200).json({
      status: "success",
      message: " Successfull Delivery note created sent ",
      data: delivery,
    });
  });
  
  const index = asyncWrapper(async (req, res) => {
    const data = await DeliveryNote.findAll({
      include: {
        model: DeliveryNoteDetail,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },

    });
  
    return res.status(200).json({ status: "success", data });
  });
  
  const approve = asyncWrapper(async (req, res) => {

    const { id } = req.body;
    if (!request)
      return res.status(404).json({
        status: "error",
        message: "The ID is required",
      });
  
    let delivery = await DeliveryNote.findByPk(id, {
      include: [
        {
          model: DeliveryNoteDetail,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
  
    if (!delivery)
      return res.status(404).json({
        status: "error",
        message: "Delivery note related to this Id not found",
      });
  
    await DeliveryNote.update(
      { status: "APPROVED" },
      { where: { id } }
    );
  
    return res
      .status(200)
      .json({ status: "OK", message: "Request approved", data: delivery });
  });
  
  const show = asyncWrapper(async (req, res) => {
    if (!req.params.id) {
      return res
        .status(400)
        .json({ status: "error", message: " Id is required" });
    }
  
    const data = await DeliveryNote.findByPk(req.params.id, {
      include: [
        {
          model: DeliveryNoteDetail,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        }
          ],
          attributes: { exclude: ["createdAt", "updatedAt"] },
        });
  
    return res.status(200).json({ status: "Ok", data });
  });
  
  const destroy = asyncWrapper(async (req, res) => {
    if (!req.params.id) {
      return res.status(400).json({ status: "error", message: "Id is required" });
    }
  
    const request = await DeliveryNote.findByPk(req.params.id);
  
    if (!request) {
      return res
        .status(200)
        .json({ status: "success", message: "Delivery not found" });
    }
  
    await request.destroy();
    return res
      .status(200)
      .json({ status: "success", message: "Request successfully destroyed" });
  });
  
  
  export default { create, index, approve, show, destroy };
  