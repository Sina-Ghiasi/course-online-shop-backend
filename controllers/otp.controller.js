import asyncHandler from "express-async-handler";
import "dotenv/config";
import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import ResetPass from "../models/reset-pass.model.js";
import { generateOtp, generateToken, sendOtpSms } from "../utils.js";

export const generateAndSendOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, type } = req.body;

  const user = await User.findOne({
    phoneNumber: phoneNumber,
  });
  if (!user)
    return res.status(400).send({ message: "شماره موبایل ثبت نشده است" });

  const types = ["LOGIN", "RESET_PASS"];
  if (!types.includes(type))
    return res.status(400).send({ message: "رمز یکبار مصرف معتبر نمی باشد" });

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
    type,
    phoneNumber,
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

export const verifyOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  // check if the OTP was meant for the same phone number for which it is being verified
  if (req.otpDetail.phoneNumber !== phoneNumber)
    return res.status(400).send({
      message: "رمز یکبار مصرف به این شماره ارسال نشده بود",
    });

  // check if OTP is available in the DB
  const savedOtp = await Otp.findById(req.otpDetail.otpId);
  if (savedOtp === null)
    return res.status(400).send({
      message: "Bad Request",
    });

  // check if OTP is already used or not
  if (savedOtp.isUsed === true)
    return res.status(400).send({
      message: "رمز یکبار مصرف قبلا استفاده شده است",
    });

  // mark OTP as used because it can only used once
  savedOtp.isUsed = true;
  savedOtp.save();

  // check if OTP is equal to the OTP in the DB
  if (savedOtp.otp !== otp)
    return res.status(400).send({
      message: "رمز یکبار مصرف صحیح نبود",
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
          return res.status(400).send({ message: "ثبت نام کاربر ناموفق بود" });

        const userToken = generateToken(
          {
            userId: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            isAdmin: savedUser.isAdmin,
          },
          process.env.JWT_ACCESS_TOKEN_SECRET,
          process.env.JWT_ACCESS_EXPIRES_IN + "d"
        );

        res.status(200).send({
          name: savedUser.name,
          email: savedUser.email,
          phoneNumber: savedUser.phoneNumber,
          isAdmin: savedUser.isAdmin,
          token: userToken,
        });
      }

      break;
    case "LOGIN":
      {
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
      }

      break;
    case "RESET_PASS":
      {
        const resetPassInstance = new ResetPass({
          userId: user._id,
        });
        const savedResetPass = await resetPassInstance.save();

        const resetPassDetail = {
          userId: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          resetPassId: savedResetPass._id,
        };
        const resetPassToken = generateToken(
          resetPassDetail,
          process.env.JWT_RESET_PASS_TOKEN_SECRET,
          process.env.JWT_RESET_PASS_EXPIRES_IN + "s"
        );
        res.status(200).send({
          userId: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          isAdmin: user.isAdmin,
          token: resetPassToken,
        });
      }
      break;
    default:
      res.status(400).send({
        message: "رمز یکبار مصرف صحیح نبود",
      });
      break;
  }
});
