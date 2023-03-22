import { Role, Permission, RolePermission } from "../models";

const getAllRoles = async (req, res) => {
  const roles = await Role.findAll({});
  res.status(200).json({ message: "ok", roles });
};

const getRole = async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ status: "error", message: "Bad Request" });
  if(isNaN(req.params.id)){
    return res.status(400).json({ status: "error", message: `Id should be a number` });
  }

  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(204).json({ message: `Role with id  does not exist` });
    }
    res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({status: `error`, message: `Error: ${error.message}`});
  }
};

const createRole = async (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }
  req.body["display_name"] = !req.body?.display_name
    ? req.body.name
    : req.body["display_name"];

  try {
    const role = await Role.create(req.body);

    return res.status(201).json({ message: "ok", role });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

const updateRole = async (req, res) => {
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
    .json({ status: "ok", message: "Role updated successfully", role });
};

const deleteRole = async (req, res) => {
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
};
export default {
  getAllRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
};
