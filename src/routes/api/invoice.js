import express from "express";
import invoiceController from "../../controllers/accountant/invoiceController";

const routes = express.Router();

routes.post("/add", invoiceController.create);
routes.get("/all", invoiceController.index);
routes.post("/approve", invoiceController.approve);
routes.get("/:id", invoiceController.show);
routes.delete("/delete/:id", invoiceController.destroy);

export default routes;
