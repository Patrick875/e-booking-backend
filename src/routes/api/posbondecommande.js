import express from "express";
import posbondecommandeController from "../../controllers/productCheckout/posbondecommandeController";

const routes = express.Router();

routes.get("/all", posbondecommandeController.index);
routes.post("/delete", posbondecommandeController.destroy);
routes.put("/update", posbondecommandeController.update);

export default routes;
