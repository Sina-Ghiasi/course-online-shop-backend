import jwt from "jsonwebtoken";
import "dotenv/config";
import otpGenerator from "otp-generator";
import kavenegar from "kavenegar";

export const generateToken = (json, secret, expiresIn) => {
  return jwt.sign(json, secret, {
    expiresIn: expiresIn,
  });
};
export const generateOtp = () => {
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

export const sendOtpSms = (phoneNumber, otp) => {
  const smsAPI = kavenegar.KavenegarApi({
    apikey: process.env.KAVEEGAR_API_KEY,
  });

  return new Promise((resolve, reject) => {
    smsAPI.VerifyLookup(
      {
        receptor: phoneNumber,
        token: otp,
        template: process.env.KAVEEGAR_API_TEMPLATE,
      },
      (response, status) => {
        if (status === 200 && response[0]) {
          resolve({
            status: "success",
            statusCode: status,
          });
        } else {
          reject({ status: "failure", statusCode: status });
        }
      }
    );
  });
};
