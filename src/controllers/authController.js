import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../models';

import dotenv from 'dotenv'
dotenv.config()

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  }

  const foundUser = await User.find({ email }).exec();
  if (!foundUser) return res.status(401).json({message : "user not registered"}); // Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10m' },
    );

    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' },
    );
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    return res.status(200).json({ roles,foundUser, accessToken, message: 'Loggin succesfull' });
  }
  return res.status(401).json({ message: 'Login failed' });
};

export default { handleLogin };
