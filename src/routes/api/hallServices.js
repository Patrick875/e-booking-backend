import express from "express";
import hallServiceController from "../../controllers/halls/hallServiceController";

const routes = express.Router();

routes.get("/all", hallServiceController.GetAllService);
routes.post("/add", hallServiceController.CreateHallService);
routes.delete("/delete/:id", hallServiceController.DeleteHallService);
routes.put("/update", hallServiceController.UpdateHallService);

export default routes;