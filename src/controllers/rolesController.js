/* eslint-disable consistent-return */
import bcrypt from "bcrypt";
import { Role } from "../models";

const getAllRoles = async (req, res) => {
  const roles = await Role.findAll({});
  res.status(200).json({ message: "ok", roles });
};

const getRole = async (req, res) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) {
    return res
      .status(204)
      .json({ message: `Role with id  does not exist` });
  }
  res.status(200).json(role);
};

const createRole = async (req, res) => {
  if (
    !req.body.name
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }
  req.body['display_name'] = !req.body?.display_name ?  req.body.name : req.body['display_name'];

  const role = await Role.create(req.body);
  return res.status(201).json({ message: "ok", role });
};

export default {
  getAllRoles,
  getRole,
  createRole,
};
