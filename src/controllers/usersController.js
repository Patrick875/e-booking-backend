/* eslint-disable consistent-return */
import bcrypt from "bcrypt";
import { User } from "../models";
import { Role } from "../models";

const getAllUsers = async (req, res) => {
  const users = await User.findAll({include:  Role});
  res.status(200).json({ message: "ok", users });
};

const getUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res
      .status(204)
      .json({ message: `User with id : ${req.params.id} does not exist` });
  }
  res.status(200).json(user);
};

const createUser = async (req, res) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.phone
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }

  req.body["password"] = await bcrypt.hash("12345678", 10);
  req.body["roleId"] = req.body?.role ? req.body.role : 1;

  const user = await User.create(req.body);
  return res.status(201).json({ message: "ok", user });
};

export default {
  getAllUsers,
  getUser,
  createUser,
};
