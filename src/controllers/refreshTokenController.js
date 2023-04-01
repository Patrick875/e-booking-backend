import { User } from '../models'
import jwt from 'jsonwebtoken'

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken }).exec();
    if (!user) return res.status(403).json({status : 'error', message : 'Forbbiden'}); //Forbidden
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || user.email !== decoded.user.email) return res.status(403).json({ status: 'error', message : 'Forbidden' });

            const accessToken = jwt.sign(
                {user},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '60m' }
            );
            res.status(200).json({ user, accessToken })
        }
    );
}

export default {handleRefreshToken}