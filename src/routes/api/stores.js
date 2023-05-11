import express from 'express';
import storeContoller from '../../controllers/stock/storeContoller';

const routes = express.Router();

routes.get('/all', storeContoller.index);
routes.post('/add', storeContoller.create);
routes.put('/update', storeContoller.update);
routes.delete('/delete/:id', storeContoller.destroy);
routes.get('/:id', storeContoller.show);



export default routes