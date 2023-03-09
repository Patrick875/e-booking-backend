/* eslint-disable consistent-return */
import mongoose from 'mongoose';
const {ObjectId} = mongoose.Types;

import User from '../models/User';

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};

const getUser = async (req, res) => {

  if (!ObjectId.isValid(req.params.id))  {
    return res
      .status(422)
      .json({ message: 'Id should be a valid mongoose ObjectId' });
  } ;
  
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res.status(204).json({ message: `User with id : ${req.params.id} does not exist` });
  }
  res.status(200).json(user);
};

export default {
  getAllUsers,
  getUser,
};
