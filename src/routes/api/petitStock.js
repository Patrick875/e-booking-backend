import express from 'express'
import petitStockRequestController from '../../controllers/stock/petitStockRequestController'

const routes = express.Router()

routes.post('/order/add',petitStockRequestController.create )
routes.get('/order/all',petitStockRequestController.index )
routes.get('/all',petitStockRequestController.getPetitStocks )
routes.post('/order/approve',petitStockRequestController.approve )
routes.get('/balance',petitStockRequestController.balance )
routes.get('/order/:id',petitStockRequestController.show )
routes.delete('/order/delete/:id',petitStockRequestController.destroy )

export default routes