import express from 'express';
import stockReceiveVoucher from '../../controllers/stock/stockReceiveVoucher'

const routes = express.Router() 

routes.post('/add', stockReceiveVoucher.create)

export default routes