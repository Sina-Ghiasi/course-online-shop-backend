import express from "express";
import asyncHandler from "express-async-handler";
import Order from "../models/order.js";
import { isAdmin, isAuth } from "../utils.js";

const router = express.Router();

router.get(
  "/",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find()
      .populate("user")
      .populate("orderItems.product");
    res.json(orders);
  })
);

router.get(
  "/mine",
  isAuth,
  asyncHandler(async (req, res) => {
    const paidOrders = await Order.find({
      $and: [{ user: req.user._id }, { status: "paid" }],
    });
    res.json(paidOrders);
  })
);

export default router;
