import express from 'express';
import packageController from '../../controllers/packageController';

const routes = express.Router();

routes.get('/all', packageController.GetPackages);
routes.post('/add', packageController.CreatePackage);
routes.put('/update', packageController.UpdatePackage);
routes.delete('/delete/:id', packageController.DeletePackage);
routes.get('/:id', packageController.GetPackage);

export default routes;