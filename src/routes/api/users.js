// eslint-disable-next-line import/no-import-module-exports
import express from 'express';
import verfyJWT from '../../middleware/verifyJWT';
import usersController from '../../controllers/usersController';

const router = express.Router();

router.route('/all').get(verfyJWT, usersController.getAllUsers)
router.route('/:id')
  .get(verfyJWT, usersController.getUser);

module.exports = router;
