import jwt from "jsonwebtoken";
import "dotenv/config";

export const isUserAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // authHeader : Bearer XXXXXX
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).send({
      status: "failed",
      message: "Not authorized : token not found !",
    });

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error)
      return res.status(403).send({
        status: "failed",
        message: "Not authorized : token not verified !",
      });

    req.user = decoded;
    next();
  });
};

export const isOtpAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // authHeader : Bearer XXXXXX
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).send({
      status: "failed",
      message: "Not authorized : token not found !",
    });

  jwt.verify(token, process.env.JWT_OTP_TOKEN_SECRET, (error, decoded) => {
    if (error)
      return res.status(403).send({
        status: "failed",
        message: "Not authorized : token not verified !",
      });

    req.otpDetail = decoded;
    next();
  });
};
