import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

export const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // authHeader : Bearer XXXXXX
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .send({ message: "Not authorized : token not found !" });

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (error, user) => {
    if (error)
      res
        .status(403)
        .send({ message: "Not authorized : token not verified !" });

    req.user = user;
    next();
  });
};
