import express from 'express';
import customerController from '../../controllers/customerController'

const routes = express.Router();

routes.post('/add', customerController.CreateCustomer);
routes.get('/all', customerController.GetAllCustomers);

export default routes;