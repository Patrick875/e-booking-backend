import express from 'express';
import productController from '../../controllers/productController';

const routes = express.Router();

routes.get('/all', productController.GetAllProducts);
routes.post('/add', productController.CreateProduct);
routes.put('/update', productController.UpdateProduct);
routes.delete('/delete/:id', productController.DeleteProduct);
routes.get('/:id', productController.GetProductById);

export default routes;