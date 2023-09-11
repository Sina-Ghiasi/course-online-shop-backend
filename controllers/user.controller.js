import asyncHandler from "express-async-handler";
import "dotenv/config";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import ResetPass from "../models/reset-pass.model.js";
import bcrypt from "bcryptjs";
import { generateToken, generateOtp, sendOtpSms } from "../utils.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  if (
    await User.findOne({
      phoneNumber: phoneNumber,
    })
  )
    return res.status(400).send({ message: "Phone Number already registered" });

  if (await User.findOne({ email: email }))
    return res.status(400).send({ message: "Email already registered" });

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
      message: "SMS not send",
      detail: { smsApiResponse: smsApiResponse.statusCode },
    });

  const otpDetail = {
    name,
    email,
    phoneNumber,
    hashedPassword,
    type: "SIGNUP",
    otpId: savedOtp._id,
    createdAt: savedOtp.createdAt,
  };

  const otpToken = generateToken(
    otpDetail,
    process.env.JWT_OTP_TOKEN_SECRET,
    process.env.JWT_OTP_EXPIRES_IN + "s"
  );

  res.status(200).send({
    token: otpToken,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  const user = await User.findOne({ phoneNumber: phoneNumber });
  if (!user)
    return res.status(400).send({ message: "Phone Number not registered" });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect)
    return res.status(400).send({
      message: "Phone number or password not correct",
    });

  const userToken = generateToken(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    process.env.JWT_ACCESS_EXPIRES_IN + "d"
  );
  res.status(200).send({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isAdmin: user.isAdmin,
    token: userToken,
  });
});

export const resetPass = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  // check if the OTP was meant for the same phone number for which it is being verified
  if (req.resetPassDetail.userId !== userId)
    return res.status(400).send({
      message: "reset password was not for this particular user",
    });

  // check if reset pass is available in the DB
  const resetPass = await ResetPass.findById(req.resetPassDetail.resetPassId);

  if (resetPass === null)
    return res.status(400).send({
      message: "Bad Request",
    });

  // check if reset pass is already used or not
  if (resetPass.isUsed === true)
    return res.status(400).send({
      message: "reset password already used",
    });

  // mark reset pass as used because it can only used once
  resetPass.isUsed = true;
  resetPass.save();

  // hash password
  const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

  // get user and reset password
  const user = await User.findById(userId);

  user.password = hashedPassword;
  user.save();

  const userToken = generateToken(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    process.env.JWT_ACCESS_EXPIRES_IN + "d"
  );

  res.status(200).send({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isAdmin: user.isAdmin,
    token: userToken,
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find();

  res.status(200).send(allUsers);
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const result = await User.findByIdAndRemove(req.params.userId);

  res.status(200).send(result);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  res.status(200).send(user);
});
