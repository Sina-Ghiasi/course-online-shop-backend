import asyncHandler from "express-async-handler";
import "dotenv/config";
import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import { generateOtp, generateToken, sendOtpSms } from "../utils.js";

export const generateAndSendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, type } = req.body;

  const user = await User.findOne({
    phoneNumber: phoneNumber,
  });
  if (!user)
    return res
      .status(400)
      .send({ status: "failure", message: "Phone Number not registered" });

  const types = ["LOGIN", "FORGOT_PASS", "CHANGE_PASS"];
  if (!types.includes(type))
    return res
      .status(400)
      .send({ status: "failure", message: "Incorrect OTP type provided" });

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
    type,
    phoneNumber,
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

export const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  // check if the OTP was meant for the same phone number for which it is being verified
  if (req.otpDetail.phoneNumber !== phoneNumber)
    return res.status(400).send({
      status: "failure",
      message: "OTP was not sent to this particular phone number",
    });

  // check if OTP is available in the DB
  const savedOtp = await Otp.findById(req.otpDetail._id);
  if (savedOtp === null)
    return res.status(400).send({
      status: "failure",
      message: "Bad Request",
    });

  // check if OTP is already used or not
  if (savedOtp.isUsed === true)
    return res.status(400).send({
      status: "failure",
      message: "OTP already used",
    });

  // mark OTP as used because it can only used once
  savedOtp.isUsed = true;
  savedOtp.save();

  // check if OTP is equal to the OTP in the DB
  if (savedOtp.otp !== otp)
    return res.status(400).send({
      status: "failure",
      message: "OTP NOT Matched",
    });

  const user = await User.findOne({
    phoneNumber: phoneNumber,
  });

  // OTP verified lets do the job base on OTP type
  switch (req.otpDetail.type) {
    case "SIGNUP":
      {
        const { name, email, phoneNumber, hashedPassword } = req.otpDetail;

        const user = new User({
          name: name,
          email: email.toLowerCase(),
          phoneNumber: phoneNumber,
          password: hashedPassword,
        });

        const savedUser = await user.save();
        if (!savedUser)
          return res
            .status(400)
            .send({ status: "failed", message: "User registration failed" });

        const UserToken = generateToken(
          {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            isAdmin: savedUser.isAdmin,
          },
          process.env.JWT_ACCESS_TOKEN_SECRET,
          process.env.JWT_ACCESS_EXPIRES_IN
        );

        res.status(200).send({
          status: "success",
          data: {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            phoneNumber: savedUser.phoneNumber,
            isAdmin: savedUser.isAdmin,
            token: UserToken,
          },
        });
      }

      break;
    case "LOGIN":
      {
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
      }

      break;
    case "FORGOT_PASS":
      break;
    case "CHANGE_PASS":
      break;
    default:
      res.status(400).send({
        status: "failure",
        message: "Incorrect OTP type provided",
      });
      break;
  }
});
