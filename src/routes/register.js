import express from 'express';
const router = express.Router();
import registerController from '../controllers/registerController';

router.post('/', registerController.handleNewUser);

export default router;