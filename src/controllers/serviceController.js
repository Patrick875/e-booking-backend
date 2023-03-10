import { Service , ServiceCategory } from "../models";


const CreateService = async (req, res) => {
    if (!req.body?.name || !req.body?.category) {
      return res
        .status(400)
        .json({ status: "error", message: "Name and Category is required" });
    }
  
    const category = await ServiceCategory.findByPk(req.body.category);
  
    if (!category)
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
  
  
    const service = await Service.create({
      name: req.body.name,
      service_categiryId: req.body.category,
    });
  
    return res.status(200).json({ status: "ok", data: service });
  };
  
  const UpdateService = (req, res) => {
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
      name: req.body.name ? req.body.name : Service.name,
      service_categiryId: req.body.category
        ? req.body.category
        : Service.category,
    });
  };
  
  const DeleteService = async (req, res) => {
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
  };
  
  const GetAllServices = async (req, res) => {
    const services = await Service.findAll({ include: [ServiceCategory] });
    return res.status(200).json({ status: "ok", data: services });
  };
  
  const GetServiceById = async (req, res) => {
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
  };  
  
  export default {
    CreateService,
    UpdateService,
    DeleteService,
    GetAllServices,
    GetServiceById,
  };
  