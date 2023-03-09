import express from 'express';
import logoutController from '../controllers/logoutController';

const router = express.Router();

router.get('/', logoutController.handleLogout);

export default router;
