import express from "express";
import asyncHandler from "express-async-handler";
import { registerValidation, loginValidation } from "../validations.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { generateToken } from "../utils.js";

const router = express.Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    //validate user data
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    // checking if the user is already in the DB
    const emailExist = await User.findOne({ email: req.body.email });
    const phoneNumberExist = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (emailExist)
      return res.status(400).send({ message: "Email already exists !" });
    if (phoneNumberExist)
      return res.status(400).send({ message: "Phone Number already exists !" });

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      phoneNumber: req.body.phoneNumber,
      password: hashedPassword,
    });
    try {
      const savedUser = await user.save();
      res.send({
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
        phoneNumber: savedUser.phoneNumber,
        token: generateToken(savedUser),
      });
    } catch (error) {
      res.status(400).send(error);
    }
  })
);
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    // validate user data
    const { error } = loginValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // checking if the email exists
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return res.status(400).send({ message: "Email not found !" });

    // password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send({ message: "Email or Password is wrong !" });
    res.send({
      _id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);
export default router;
