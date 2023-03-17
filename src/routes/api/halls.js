import express from 'express';
import hallsController from '../../controllers/hallController';
const routes = express.Router();


routes.post('/add', hallsController.CreateHall)
routes.get('/all', hallsController.AllHalls)
routes.put('/update/:id', hallsController.UpdateHall)
routes.delete('/delete/:id', hallsController.DeleteHall)

export default routes;