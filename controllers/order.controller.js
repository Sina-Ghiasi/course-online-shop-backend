import asyncHandler from "express-async-handler";
import Order from "../models/order.model";

export const getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await Order.find()
    .populate("userId")
    .populate("orderItems.product");

  res.status(200).send(allOrders);
});

export const getMyPaidOrders = asyncHandler(async (req, res) => {
  const myPaidOrders = await Order.find({
    $and: [{ userId: req.user._id }, { status: "paid" }],
  });
  res.status(200).send(myPaidOrders);
});
