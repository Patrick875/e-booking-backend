import express from 'express'
import petitTableController from '../../controllers/petitTableController'

const routes = express.Router()

routes.get('/all',petitTableController.index )
routes.get('/activate/:id',petitTableController.activateTable )
routes.delete('/delete/:id',petitTableController.destroy )
routes.get('/disactivate/:id',petitTableController.disActivateTable )
routes.post('/add',petitTableController.create )

export default routes