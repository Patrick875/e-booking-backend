import express from 'express';
import roomClassController from '../../controllers/roomClassController';

const routes = express.Router();

routes.get('/all', roomClassController.get);