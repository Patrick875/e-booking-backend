import express from "express";
import customerBillController from "../../controllers/productCheckout/customerBillController";

const routes = express.Router();

routes.get("/all", customerBillController.index);
routes.post("/delete", customerBillController.destroy);
routes.put("/update", customerBillController.update);

export default routes;
