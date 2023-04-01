import { Role, Permission, RolePermission } from "../models";
import { asyncWrapper } from '../utils/handlingTryCatchBlocks'

const getAllRoles = asyncWrapper( async (req, res) => {
  const roles = await Role.findAll({});
  res.status(200).json({ message: "ok", roles });
});

const getRole = asyncWrapper( async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ status: "error", message: "Bad Request" });
  if(isNaN(req.params.id)){
    return res.status(400).json({ status: "error", message: `Id should be a number` });
  }

 
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(204).json({ message: `Role with id  does not exist` });
    }
    res.status(200).json({status: 'success', data: role});

});

const createRole = asyncWrapper( async (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }
  req.body["display_name"] = !req.body?.display_name
    ? req.body.name
    : req.body["display_name"];

    if(await Role.findOne({ where : { name : req.body.name } }))
    {
      return res.status(409).json({ status: 'error', message: 'Role already exists' });
    }


    const role = await Role.create(req.body);

    return res.status(201).json({ message: "ok", role });
 
});

const updateRole = asyncWrapper( async (req, res) => {
  if (!req.body.id)
    return res.status(400).json({ status: "error", message: "Bad Request" });

  const role = await Role.findByPk(req.body.id);

  if (!role) {
    return res.status(204).json({ message: `Role with id  does not found` });
  }

  role.set(req.body);
  await role.save();

  return res
    .status(200)
    .json({ status: "ok", message: "Role updated successfully", data: role });
});

const deleteRole = asyncWrapper( async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ status: "error", message: "Bad Request" });

  const role = await Role.findByPk(req.params.id);

  if (!role) {
    return res.status(204).json({ message: `Role with id  does not found` });
  }
  await role.destroy();
  return res
    .status(200)
    .json({ status: "ok", message: "Role deleted successfully" });
});
export default {
  getAllRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
};
