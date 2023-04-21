import express from 'express';
import authController from '../controllers/authController';
const router = express.Router();

router.post('/login', authController.handleLogin);
router.post('/reset', authController.resetPassword);

module.exports = router;