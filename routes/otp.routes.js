import express from "express";
import { isOtpAuth } from "../middlewares/authorization.middlewares.js";
import {
  otpViaSmsGenerateValidation,
  otpViaSmsVerifyValidation,
} from "../middlewares/validations.middlewares.js";
import * as otpController from "../controllers/otp.controller.js";

const router = express.Router();

router.post(
  "/via-sms/generate",
  otpViaSmsGenerateValidation,
  otpController.generateAndSendOtp
);
router.post(
  "/via-sms/verify",
  isOtpAuth,
  otpViaSmsVerifyValidation,
  otpController.verifyOtp
);

export default router;
