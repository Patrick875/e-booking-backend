import express from 'express';
import customerController from '../../controllers/customerController'

const routes = express.Router();

routes.post('/add', customerController.CreateCustomer);
routes.get('/all', customerController.GetAllCustomers);
routes.get('/delete/:id', customerController.DeleteCustomer);
routes.get('/update', customerController.UpdateCustomer);

export default routes;