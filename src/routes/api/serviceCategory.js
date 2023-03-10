import express from 'express';
import serviceCategoryController from '../../controllers/serviceCategoryController';

const routes = express.Router();

routes.get('/all', serviceCategoryController.GetServiceCategories);
routes.post('/add', serviceCategoryController.CreateServiceCategory);
routes.put('/update', serviceCategoryController.UpdateServiceCategory);
routes.delete('/delete/:id', serviceCategoryController.DeleteServiceCategory);
routes.get('/:id', serviceCategoryController.GetServiceCategory);

export default routes;