import express, { Router } from 'express';
import cashFlowController from '../../controllers/sales/cashFlowController'
const routes = express.Router();

routes.post('/debit', cashFlowController.debit )
routes.post('/credit', cashFlowController.credit )
routes.get('/all', cashFlowController.cashFlows )

export default routes