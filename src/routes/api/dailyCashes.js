import express from 'express';
import dailySalesController from '../../controllers/sales/dailySalesController'
const routes = express.Router();

routes.post('/add', dailySalesController.create )
routes.post('/add-datails', dailySalesController.addDetail )
routes.get('/all', dailySalesController.index )
routes.put('/update', dailySalesController.update )
routes.delete('/delete/:id', dailySalesController.destroy )

export default routes