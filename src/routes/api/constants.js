import express from 'express';
import constansCotroller from '../../controllers/constansCotroller';

const routes = express.Router();

routes.get('/all', constansCotroller.index);
routes.post('/add', constansCotroller.create);
routes.put('/update', constansCotroller.update);
routes.delete('/delete/:id', constansCotroller.destroy);
routes.get('/:id', constansCotroller.show);

export default routes;