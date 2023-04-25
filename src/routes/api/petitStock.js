import express from 'express'
import petitStockController from '../../controllers/stock/petitStockController'

const routes = express.Router()

routes.get('/balance',petitStockController.balance )
routes.get('/all',petitStockController.index )
routes.get('/activate/:id',petitStockController.activatePetitStock )
routes.get('/disactivate/:id',petitStockController.disActivatePetitStock )
routes.post('/add',petitStockController.create )

export default routes