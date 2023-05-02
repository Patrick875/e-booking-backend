import express from "express";
import bonDeCommandeController from "../../controllers/accountant/bonDeCommandeController";

const routes = express.Router();

routes.post("/add", bonDeCommandeController.create);
routes.get("/all", bonDeCommandeController.index);
routes.post("/approve", bonDeCommandeController.approve);
routes.get("/:id", bonDeCommandeController.show);
routes.delete("/delete/:id", bonDeCommandeController.destroy);

export default routes;
