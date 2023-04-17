import express from 'express';
import stockPurchaaseController from '../../controllers/stock/stockPurchaseOrderController';

const routes = express.Router();

routes.get('/all', stockPurchaaseController.index);
routes.post('/add', stockPurchaaseController.create);
routes.put('/update', stockPurchaaseController.update);
routes.delete('/delete/:id', stockPurchaaseController.destroy);
routes.get('/approved', stockPurchaaseController.getApproved);
routes.get('/pending', stockPurchaaseController.getNotApproved);
routes.post('/approve', stockPurchaaseController.approve);

export default routes