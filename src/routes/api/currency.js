import express from "express";
import currencyController from "../../controllers/currencyController";

const routes = express.Router();

routes.get('/rate', currencyController.index);

export default routes
