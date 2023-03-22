import { Role,Permission, RolePermission } from "../models";

const index = async (req, res) => {
  const data = await Permission.findAll({});
  res.status(200).json({ message: "ok", data });
};

const show = async (req, res) => {

  if(!req.params.id) return res.status(400).json({ status: "error", message: "Bad Request" });

  const row = await Permission.findByPk(req.params.id);
  if (!row) {
    return res
      .status(204)
      .json({ message: `Permission with id  does not exist`});
  }
  res.status(200).json({status: 'ok', data:row});
};

const create = async (req, res) => {

  if (
    !req.body.name
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }
  req.body['display_name'] = !req.body?.display_name ?  req.body.name : req.body['display_name'];

  const role = await Role.create(req.body);


//   Object.keys(req.body).forEach(async (key, val) => {
//     let permissions = {};
//     if (key.startsWith("permission_")) {
//       permissions.PermissionId = Number(key.split("_")[1]);
//       permissions.RoleId = role.id;

//       let pkg = await Permission.findByPk(Number(key.split("_")[1]));
//       if (pkg) {
//         await RolePermission.create(permissions);
//       }
//     }
//   });

  return res.status(201).json({ message: "ok", role });
};

const updateRole = async (req, res) => {

  if(!req.body.id) return res.status(400).json({ status: "error", message: "Bad Request" });

  const role = await Role.findByPk(req.body.id);

  if(!role) {
    return res.status(204).json({ message: `Role with id  does not found` });
  }

  role.set(req.body)
  await role.save();

  return res.status(200).json({ status: "ok", message: "Role updated successfully",  role });
}

const deleteRole = async (req, res) => {
  if(!req.params.id) return res.status(400).json({ status: "error", message: "Bad Request" });

  const role = await Role.findByPk(req.params.id);

  if(!role) {
    return res.status(204).json({ message: `Role with id  does not found` });
  }
  await role.destroy();
  return res.status(200).json({ status: "ok", message: "Role deleted successfully" });
}
export default {
  getAllRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
};
