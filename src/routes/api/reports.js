import express from 'express';
import reportController from '../../controllers/reports/reportController';

const routes = express.Router();

routes.get('/yearly/reservation', reportController.yearlyReservation);
routes.get('/yearly/sales', reportController.yearlySales);
// routes.post('/add', reportController.CreateReservation);
// routes.post('/pay', reportController.PayReservation);
// routes.put('/update', reportController.UpdateReservation);
// routes.get('/:id', reportController.GetReservation); 
// routes.delete('/delete/:id', reportController.DeleteReservation); 
// routes.get('/check/:id', reportController.ChechOutReservation);

export default routes;