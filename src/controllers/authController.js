import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User,  Role} from '../models';
import dotenv from 'dotenv';
import { asyncWrapper } from '../utils/handlingTryCatchBlocks';

dotenv.config()

const handleLogin = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }

  const user = await User.findOne({ where: { email },
    include: {
    model: Role,
    as: 'Role',
    attributes: { exclude : ['createdAt', 'updatedAt'] }
  },
attributes: { exclude : ['createdAt', 'updatedAt', 'refreshToken', 'roleId' ,'verifiedAT']} });
  
  if (!user) return res.status(401).json({message : "user not registered"}); // Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, user.password);
  if (match) {  

    // const roles = Object.values(user.roles).filter(Boolean);
    // create JWTs
    const accessToken = jwt.sign(
      {
        user
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '120m' },
    );

    const refreshToken = jwt.sign(
      { user},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' },
    );

    // Saving refreshToken with current user
    user.refreshToken = refreshToken;
    await user.save();

    

    // Creates Secure Cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'None',
      expiresIn: expirationDate,
      maxAge: 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    return res.status(200).json({ user, accessToken, message: 'Loggin succesfull' });
  }
  return res.status(401).json({ message: 'Login failed' });
});

export default { handleLogin };