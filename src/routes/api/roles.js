import express from 'express';
import roleController from "../../controllers/rolesController";

const router = express.Router();

router.route("/all").get(roleController.getAllRoles);
router.route("/add").post(roleController.createRole);
router.route("/update").put(roleController.updateRole);
router.route("/:id").get(roleController.getRole);
router.route("/delete/:id").delete(roleController.deleteRole);

module.exports = router;
