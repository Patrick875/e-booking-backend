import express from 'express';
import chartController from '../../controllers/chatController'
const routers = express.Router();

routers.post('/create', chartController.create)
routers.get('/show', chartController.show)
// routers.post('/admin/show', chartController.adminShow)

export default routers