import express from "express";
import petitStockRequestController from "../../controllers/stock/petitStockRequestController";

const routes = express.Router();

routes.post("/add", petitStockRequestController.create);
routes.get("/all", petitStockRequestController.index);
routes.post("/approve", petitStockRequestController.approve);
routes.post("/cancel", petitStockRequestController.cancel);
routes.get("/:id", petitStockRequestController.show);
routes.delete("/delete/:id", petitStockRequestController.destroy);

export default routes;
