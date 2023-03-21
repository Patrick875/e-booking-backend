import express from 'express';
import hallsController from '../../controllers/halls/hallController';
const routes = express.Router();


routes.post('/add', hallsController.CreateHall)
routes.get('/all', hallsController.AllHalls)
routes.get('/:id', hallsController.SingleHall)
routes.put('/update', hallsController.UpdateHall)
routes.delete('/delete/:id', hallsController.DeleteHall)

export default routes; 