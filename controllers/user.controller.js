import asyncHandler from "express-async-handler";
import "dotenv/config";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import bcrypt from "bcryptjs";
import { generateToken, generateOtp, sendOtpSms } from "../utils.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  if (
    await User.findOne({
      phoneNumber: phoneNumber,
    })
  )
    return res
      .status(400)
      .send({ status: "failed", message: "Phone Number already registered" });

  if (await User.findOne({ email: email }))
    return res
      .status(400)
      .send({ status: "failed", message: "Email already registered" });

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check phone number validation by sending OTP
  const otpInstance = new Otp({
    otp: generateOtp(),
  });

  const savedOtp = await otpInstance.save();

  const smsApiResponse = await sendOtpSms(phoneNumber, savedOtp.otp);
  if (smsApiResponse && smsApiResponse.status === "failure")
    return res.status(400).send({
      status: "failure",
      message: "SMS not send",
      detail: { smsApiResponse: smsApiResponse.statusCode },
    });

  const otpDetail = {
    name,
    email,
    phoneNumber,
    hashedPassword,
    type: "SIGNUP",
    _id: savedOtp._id,
    createdAt: savedOtp.createdAt,
  };

  const otpToken = generateToken(
    otpDetail,
    process.env.JWT_OTP_TOKEN_SECRET,
    process.env.JWT_OTP_EXPIRES_IN
  );

  res.status(200).send({
    status: "status",
    data: {
      token: otpToken,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  const user = await User.findOne({ phoneNumber: phoneNumber });
  if (!user)
    return res
      .status(400)
      .send({ status: "failed", message: "Phone Number not registered" });

  const isPasswordCorrect = await bcrypt.compare(user.password, password);
  if (isPasswordCorrect)
    return res.status(400).send({
      status: "failed",
      message: "Phone number or password not correct",
    });

  const UserToken = generateToken(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    process.env.JWT_ACCESS_EXPIRES_IN
  );
  res.status(200).send({
    status: "success",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      token: UserToken,
    },
  });
});
