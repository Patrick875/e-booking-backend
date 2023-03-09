import express from 'express';
import roleController from "../../controllers/rolesController";

const router = express.Router();

router.route("/all").get(roleController.getAllRoles);
router.route("/add").post(roleController.createRole);
router.route("/:id").get(roleController.getRole);

module.exports = router;
