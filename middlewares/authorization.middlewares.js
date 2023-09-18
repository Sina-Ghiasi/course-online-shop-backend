import jwt from "jsonwebtoken";
import "dotenv/config";

export const isUserAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // authHeader : Bearer XXXXXX
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).send({
      message: "عملیات مجاز نیست : توکن پبدا نشد",
    });

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error)
      return res.status(403).send({
        message: "عملیات مجاز نیست : توکن نامعتبر است",
      });

    req.user = decoded;
    next();
  });
};

export const hasAdminAccess = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(401).send({
      message: "عملیات مجاز نیست : شما دسترسی ادمین ندارید",
    });

  next();
};

export const isOtpAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // authHeader : Bearer XXXXXX
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).send({
      message: "عملیات مجاز نیست : توکن پیدا نشد",
    });

  jwt.verify(token, process.env.JWT_OTP_TOKEN_SECRET, (error, decoded) => {
    if (error)
      return res.status(403).send({
        message: "عملیات مجاز نیست :  توکن نامعتبر است",
      });

    req.otpDetail = decoded;
    next();
  });
};

export const isResetPassAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // authHeader : Bearer XXXXXX
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).send({
      message: "عملیات مجاز نیست : توکن یافت نشد",
    });

  jwt.verify(
    token,
    process.env.JWT_RESET_PASS_TOKEN_SECRET,
    (error, decoded) => {
      if (error)
        return res.status(403).send({
          message: "عملیات مجاز نیست : توکن نامعتبر است",
        });

      req.resetPassDetail = decoded;
      next();
    }
  );
};
