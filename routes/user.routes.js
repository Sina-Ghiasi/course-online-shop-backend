import express from "express";
import * as userController from "../controllers/user.controller.js";
import {
  loginUserValidation,
  registerUserValidation,
  resetPassValidation,
} from "../middlewares/validations.middlewares.js";
import {
  hasAdminAccess,
  isResetPassAuth,
  isUserAuth,
} from "../middlewares/authorization.middlewares.js";

const router = express.Router();

router.post("/register", registerUserValidation, userController.registerUser);
router.post("/login", loginUserValidation, userController.loginUser);
router.post(
  "/reset-pass",
  isResetPassAuth,
  resetPassValidation,
  userController.resetPass
);
router.get("/", isUserAuth, hasAdminAccess, userController.getAllUsers);
router.get("/:userId", isUserAuth, hasAdminAccess, userController.getUserById);
router.delete(
  "/:userId",
  isUserAuth,
  hasAdminAccess,
  userController.deleteUserById
);

export default router;
