import express from 'express';
import roomController from '../../controllers/roomController';

const routes = express.Router();

routes.get('/all', roomController.getAllRoom);
routes.post('/add', roomController.createRoom);
routes.get('/:id', roomController.getRoom);

export default routes;