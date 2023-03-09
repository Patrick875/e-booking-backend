// eslint-disable-next-line import/no-import-module-exports
import express from 'express';
import verfyJWT from '../../middleware/verifyJWT';
import usersController from '../../controllers/usersController';

const router = express.Router();

router.route('/all').get(usersController.getAllUsers)
router.route('/add').post(usersController.createUser)
router.route('/:id')
  .get(usersController.getUser);

module.exports = router;
