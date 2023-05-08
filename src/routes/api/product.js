import express from 'express';
import productController from '../../controllers/products/productController';

const routes = express.Router();

routes.get('/all', productController.GetAllProducts);
routes.post('/add', productController.CreateProduct);
routes.put('/update', productController.UpdateProduct);
routes.put('/package/update', productController.UpdateProductPackage);
routes.delete('/delete/:id', productController.DeleteProduct);
routes.get('/:id', productController.GetProductById);
routes.post('/package/sell', productController.sell)
routes.get('/package/sells', productController.allSalles)
routes.get('/package/waiter/sells/:id', productController.sellsByWaiter)
routes.post('/package/sells/approve', productController.approve)

export default routes;