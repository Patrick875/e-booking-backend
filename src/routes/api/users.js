// eslint-disable-next-line import/no-import-module-exports
import express from "express";
import verfyJWT from "../../middleware/verifyJWT";
import usersController from "../../controllers/usersController";

const router = express.Router();

router.route("/all").get(usersController.getAllUsers);
router.route("/add").post(usersController.createUser);
router.route("/delete/:id").delete(usersController.deleteUser);
router.route("/update").put(usersController.updateUser);
router.route("/:id").get(usersController.getUser);
router.route("/disactivate/:id").get(usersController.disactivate);
router.route("/reactivate/:id").get(usersController.reactivate);
router.route("/change-password").post(usersController.changePassword);

module.exports = router;
