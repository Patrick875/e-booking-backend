import express from 'express';
import serviceController from '../../controllers/serviceController';

const routes = express.Router();

routes.get('/all', serviceController.GetAllServices);
routes.post('/add', serviceController.CreateService);
routes.put('/update', serviceController.UpdateService);
routes.delete('/delete/:id', serviceController.DeleteService);
routes.get('/:id', serviceController.GetServiceById);

export default routes;

