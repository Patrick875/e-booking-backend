import express from 'express'
import petitStockRequestController from '../../controllers/stock/petitStockRequestController'

const routes = express.Router()

routes.post('/order/add',petitStockRequestController.create )
routes.get('/order/all',petitStockRequestController.index )

export default routes