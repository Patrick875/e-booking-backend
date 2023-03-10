import express from 'express';
import roomClassController from '../../controllers/roomClassController';

const routes = express.Router();

routes.get('/all', roomClassController.getAllRoomClasses);
routes.post('/add', roomClassController.createRoomClass);
routes.get('/:id', roomClassController.getRoomClass);

export default routes;