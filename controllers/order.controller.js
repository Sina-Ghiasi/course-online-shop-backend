import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import axios from "axios";
import "dotenv/config";

export const getAllOrders = asyncHandler(async (req, res) => {
  const allOrders = await Order.find()
    .populate("userId")
    .populate("orderItems.productId");

  res.status(200).send(allOrders);
});

export const getMyPaidOrders = asyncHandler(async (req, res) => {
  const myPaidOrders = await Order.find({
    $and: [{ userId: req.user._id }, { status: "paid" }],
  });
  res.status(200).send(myPaidOrders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate("userId")
    .populate("orderItems.productId");

  res.status(200).send(order);
});

export const getNumberOfOrders = asyncHandler(async (req, res) => {
  const numberOfOrders = await Order.countDocuments();

  res.status(200).send(numberOfOrders.toString());
});
export const getNumberOfOrdersBetween = asyncHandler(async (req, res) => {
  const numberOfOrders = await Order.countDocuments({
    createdAt: {
      $gte: new Date(req.body.gt).toISOString(),
      $lte: new Date(req.body.lt).toISOString(),
    },
  });

  res.status(200).send(numberOfOrders.toString());
});

export const makeOrder = asyncHandler(async (req, res) => {
  //initial order
  let totalPrice = 0;
  let orderItems = [];
  for (const id of req.body.productIds) {
    const product = await Product.findById(id);
    orderItems.push({
      name: product.name,
      price: product.price,
      discount: product.discount,
      productId: product._id,
    });
    totalPrice += product.price - product.price * (product.discount / 100);
  }
  const user = await User.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  const order = new Order({
    orderItems,
    totalPrice,
    userId: user._id,
  });
  const savedOrder = await order.save();
  //bank process

  //callback url
  const unpaidOrder = await Order.findById(savedOrder._id);
  for (const item of unpaidOrder.orderItems) {
    const result = await getSpotPlayerLicense(
      item.spotPlayerId,
      user.name,
      user.phoneNumber
    );
    if (result) {
      item.licenseKey = result.key;
    } else {
      return res.status(500).send({ message: "ساخت لایسنس ناموفق بود" });
    }
  }
  unpaidOrder.status = "paid";
  const result = await unpaidOrder.save();
  res.status(200).send(result);
});

const getSpotPlayerLicense = async (spotPlayerId, name, phoneNumber) => {
  const config = {
    headers: { $API: process.env.SPOT_PLAYER_API, $LEVEL: -1 },
  };

  axios
    .post(
      "https://panel.spotplayer.ir/license/edit/",
      {
        course: [spotPlayerId],
        name: name,
        watermark: { texts: [{ text: phoneNumber }] },
      },
      config
    )
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return false;
    });
};
export const deleteOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.orderId);

  res.status(200).send(order);
});
