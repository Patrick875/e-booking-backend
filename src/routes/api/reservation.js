import express from 'express';
import reservationController from '../../controllers/reservationController';

const routes = express.Router();

routes.get('/all', reservationController.AllReservations);
routes.post('/add', reservationController.CreateReservation);
routes.put('/update', reservationController.UpdateReservation);
routes.get('/:id', reservationController.GetReservation); 
routes.delete('/delete/:id', reservationController.DeleteReservation); 
routes.get('/check/:id', reservationController.ChechOutReservation);

export default routes;