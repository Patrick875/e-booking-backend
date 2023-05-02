import express from "express";
import deliveryNoteController from "../../controllers/accountant/deliveryNoteController";

const routes = express.Router();

routes.post("/add", deliveryNoteController.create);
routes.get("/all", deliveryNoteController.index);
routes.post("/approve", deliveryNoteController.approve);
routes.get("/:id", deliveryNoteController.show);
routes.delete("/delete/:id", deliveryNoteController.destroy);

export default routes;
