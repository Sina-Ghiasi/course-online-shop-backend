import express from "express";
import {
  isUserAuth,
  hasAdminAccess,
} from "../middlewares/authorization.middlewares.js";
import * as orderController from "../controllers/order.controller.js";
import {
  getOrderBetweenValidation,
  makeOrderValidation,
} from "../middlewares/validations.middlewares.js";

const router = express.Router();

router.get("/", isUserAuth, hasAdminAccess, orderController.getAllOrders);
router.get("/my-paid-orders", isUserAuth, orderController.getMyPaidOrders);

router.get(
  "/number-of-orders",
  isUserAuth,
  hasAdminAccess,
  orderController.getNumberOfOrders
);
router.post(
  "/number-of-orders-between",
  isUserAuth,
  hasAdminAccess,
  getOrderBetweenValidation,
  orderController.getNumberOfOrdersBetween
);

router.post(
  "/make-order",
  isUserAuth,
  makeOrderValidation,
  orderController.makeOrder
);
router.get(
  "/:orderId",
  isUserAuth,
  hasAdminAccess,
  orderController.getOrderById
);
router.delete(
  "/:orderId",
  isUserAuth,
  hasAdminAccess,
  orderController.deleteOrderById
);
export default router;
