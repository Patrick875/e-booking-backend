import express from 'express';
import ContactsController from '../../controllers/ContactsController';
import verfyJWT from '../../middleware/verifyJWT';

const router = express.Router();

router.route('/all').get(verfyJWT, ContactsController.getAllContacts)
router.route('/add').post(ContactsController.createNewContact)
router.route('/delete').delete(verfyJWT, ContactsController.deleteContact);

router.route('/:id')
  .get(verfyJWT, ContactsController.getContact);

export default router;
