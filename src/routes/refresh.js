import express from 'express';
import refreshTokenController from '../controllers/refreshTokenController';

const router = express.Router();

router.get('/refresh', refreshTokenController.handleRefreshToken);

export default router;
