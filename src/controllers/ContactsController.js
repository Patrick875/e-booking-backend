import mongoose from 'mongoose';
import Contact  from '../models/Contact';
const {ObjectId} = mongoose.Types;

const getAllContacts = async (req, res) => {
    const contacts = await Contact.find();
    if (contacts.length === 0)
    {
        return res.status(204).json({contacts,  'message': 'No contacts found.' });
    }
    res.status(200).json(contacts);
}

const createNewContact = async (req, res) => {
    if (!req?.body?.names || !req?.body?.email || !req?.body?.description) {
        return res.status(400).json({ 'message': 'Query names, email, and message are required' });
    }

   
        const result = await Contact.create({
            names: req.body.names,
            email: req.body.email,
            description: req.body.description
        });

        res.status(201).json({result, message: 'Contact created successfully.'});
 
}

const deleteContact = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Contact ID required.' });


  if (!ObjectId.isValid(req.body.id))  {
    return res
      .status(422)
      .json({ message: 'Id should be a valid mongoose ObjectId' });
  } ;

    const contact = await Contact.findOne({ _id: req.body.id }).exec();
    if (!contact) {
        return res.status(204).json({ "message": `No contact matches ID ${req.body.id}.` });
    }
    const result = await contact.deleteOne(); 
    res.status(200).json({result, message: "deleted successfully" });
}

const getContact = async (req, res) => {

    if (!ObjectId.isValid(req.params.id))  {
        return res
          .status(422)
          .json({ message: 'Id should be a valid mongoose ObjectId' });
      } ;

    const contact = await Contact.findOne({ _id: req.params.id }).exec();
    if (!contact) {
        return res.status(204).json({ "message": `No contact matches ID ${req.params.id}.` });
    }
    res.status(200).json({contact, message: 'Contact found.'});
}

export default { getAllContacts, createNewContact, deleteContact, getContact };