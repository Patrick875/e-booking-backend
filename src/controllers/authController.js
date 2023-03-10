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

  const user = await User.findOne({ where: { email } });
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
      { expiresIn: '1m' },
    );

    const refreshToken = jwt.sign(
      { user: user },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' },
    );
    // Saving refreshToken with current user
    user.refreshToken = refreshToken;
    await user.save();

    // Creates Secure Cookie with refresh token
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    return res.status(200).json({ user, accessToken, message: 'Loggin succesfull' });
  }
  return res.status(401).json({ message: 'Login failed' });
};

export default { handleLogin };
