import { Service , ServiceCategory } from "../models";
import { asyncWrapper } from "../utils/handlingTryCatchBlocks";


const CreateService = asyncWrapper( async (req, res) => {
    if (!req.body?.name || !req.body?.category) {
      return res
        .status(400)
        .json({ status: "error", message: "Name and Category is required" });
    }

    if(await Service.findOne({ where: { name : req.body.name } })) 
    {
      return res.status(409).json({status:  'error', message: 'Duplication error'})
    }

    const category = await ServiceCategory.findByPk(req.body.category, { include: [{model: Service}] });
  
    if (!category)
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
  

      const service = await Service.create({
        name: req.body.name,
        service_categoryId: req.body.category,
        price: req.body.price,
      });
      return res.status(200).json({ status: "ok", data: service });

  
  });
  
  const UpdateService = asyncWrapper( (req, res) => {
    if (!req.body.id) {
      return res
        .status(404)
        .json({ status: "error", message: "Service not found" });
    }
  
    const service = Service.findByPk(req.body.id);
    if (!service)
      return res
        .status(404)
        .json({ status: "error", message: "Service not found" });
  
    Service.set({
      name: req.body.name ? req.body.name : service.name,
      service_categoryId: req.body.category
        ? req.body.category
        : Service.category,
        price: req.body.price ? req.body.price : service.price,
    });


  });
  
  const DeleteService = asyncWrapper( async (req, res) => {
    if (!req.params.id) {
      return res
        .status(404)
        .json({ status: "error", message: "Service Id is required" });
    }
  
    const service = Service.findByPk(req.params.id);
  
    if (!service)
      return res
        .status(404)
        .json({ status: "error", message: "Service not found" });
  
    await Service.destroy();
    return res.status(200).json({ status: "ok", message: "Service deleted" });
  });
  
  const GetAllServices = asyncWrapper( async (req, res) => {
    const services = await Service.findAll({ include: [ServiceCategory] });
    return res.status(200).json({ status: "ok", data: services });
  });
  
  const GetServiceById = asyncWrapper ( async (req, res) => {
    if (!req.params.id)
      return res
        .status(400)
        .json({ status: "error", message: "Service id is required" });
  
    const service = Service.findByPk(req.params.id);
    if (!service) {
      return res
        .status(404)
        .json({ status: "error", message: "Service not found" });
    }
    return res.status(200).json({ status: "ok", data: service });
  });  
  
  export default {
    CreateService,
    UpdateService,
    DeleteService,
    GetAllServices,
    GetServiceById,
  };
  