import express from "express";
import * as userController from "../controllers/user.controller.js";
import {
  loginUserValidation,
  registerUserValidation,
} from "../middlewares/validations.middlewares.js";

const router = express.Router();

router.post("/register", registerUserValidation, userController.registerUser);
router.post("/login", loginUserValidation, userController.loginUser);
export default router;
