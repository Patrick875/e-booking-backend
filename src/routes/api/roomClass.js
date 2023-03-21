import express from 'express';
import roomClassController from '../../controllers/rooms/roomClassController';

const routes = express.Router();

routes.get('/all', roomClassController.getAllRoomClasses);
routes.post('/add', roomClassController.createRoomClass);
routes.put('/update', roomClassController.updateRoomClass);
routes.delete('/delete/:id', roomClassController.deleteRoomClass);
routes.get('/:id', roomClassController.getRoomClass);

export default routes;