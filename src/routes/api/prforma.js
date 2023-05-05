import express from "express";
import proformaController from "../../controllers/accountant/proformaController";

const routes = express.Router();

routes.post("/add", proformaController.create);
routes.get("/all", proformaController.index);
routes.post("/approve", proformaController.approve);
routes.get("/:id", proformaController.show);
routes.delete("/delete/:id", proformaController.destroy);

export default routes;
