import express from 'express';
import stockReceiveVoucher from '../../controllers/stock/stockReceiveVoucher'

const routes = express.Router() 

routes.post('/add', stockReceiveVoucher.create)
routes.get('/all', stockReceiveVoucher.index) 

export default routes