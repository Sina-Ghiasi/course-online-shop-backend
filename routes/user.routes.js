import express from "express";
import * as userController from "../controllers/user.controller.js";
import {
  loginUserValidation,
  registerUserValidation,
  resetPassValidation,
} from "../middlewares/validations.middlewares.js";
import { isResetPassAuth } from "../middlewares/authorization.middlewares.js";

const router = express.Router();

router.post("/register", registerUserValidation, userController.registerUser);
router.post("/login", loginUserValidation, userController.loginUser);
router.post(
  "/reset-pass",
  isResetPassAuth,
  resetPassValidation,
  userController.resetPass
);

export default router;
