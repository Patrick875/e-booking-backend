import express from 'express';
import BlogsController from '../../controllers/BlogsController';
import verfyJWT from '../../middleware/verifyJWT';
import verifyRoles from '../../middleware/verifyRoles';
import ROLES_LIST from '../../config/roles_list';

const router = express.Router();

router.route('/all').get(BlogsController.getAllBlogs)
router.route('/add').post(verfyJWT, BlogsController.createNewBlog)
router.route('/update').put(verfyJWT, BlogsController.updateBlog)
router.route('/delete').delete(verfyJWT, BlogsController.deleteBlog);
router.route('/:id').get(BlogsController.getBlog);

export default router;
