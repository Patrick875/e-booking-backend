import express from 'express';
import productController from '../../controllers/products/productController';

const routes = express.Router();

routes.get('/all', productController.GetAllProducts);
routes.post('/add', productController.CreateProduct);
routes.put('/update', productController.UpdateProduct);
routes.delete('/delete/:id', productController.DeleteProduct);
routes.get('/:id', productController.GetProductById);
routes.post('/package/sell', productController.sell)
routes.post('/package/sell/', productController.sell)
routes.post('/package/sells/approve', productController.approve)

export default routes;