import express from 'express';
import stockItemController from '../../controllers/stock/stockItemController';

const routes = express.Router();

routes.get('/', stockItemController.trackItemTransaction);



export default routes