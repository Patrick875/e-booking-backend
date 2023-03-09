import express from 'express';
import CommentController from '../../controllers/CommentsController';

const router = express.Router();

router.route('/update').put(CommentController.updateComment)
router.route('/delete').delete(CommentController.deleteComment);
router.route('/all/:blog_id').get(CommentController.getAllComments)
router.route('/add/:blog_id').post(CommentController.createNewComment);

router.route('/:id').get(CommentController.getComment);

export default router;
