import express from 'express';
import productCategoryController from '../../controllers/products/productCategoryController';

const routes = express.Router();

routes.get('/all', productCategoryController.GetProductCategories);
routes.post('/add', productCategoryController.CreateProductCategory);
routes.put('/update', productCategoryController.UpdateProductCategory);
routes.delete('/delete/:id', productCategoryController.DeleteProductCategory);
routes.get('/:id', productCategoryController.GetProductCategory);

export default routes;