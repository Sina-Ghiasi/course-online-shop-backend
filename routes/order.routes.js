import express from "express";
import {
  isUserAuth,
  hasAdminAccess,
} from "../middlewares/authorization.middlewares.js";
import * as orderController from "../controllers/order.controller.js";

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
  orderController.getNumberOfOrdersBetween
);
export default router;
