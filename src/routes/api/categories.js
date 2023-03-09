import express from 'express';
import CategoriesController from '../../controllers/CategoriesController';
import verfyJWT from '../../middleware/verifyJWT';

const router = express.Router();
router.route('/all').get(CategoriesController.getAllCategories);
router.route('/add').post(verfyJWT, CategoriesController.createNewCategory);
router.route('/update').put(verfyJWT, CategoriesController.updateCategory);
router.route('/delete').delete(verfyJWT, CategoriesController.deleteCategory);

router.route('/:id')
  .get(CategoriesController.getCategory);

export default router;
