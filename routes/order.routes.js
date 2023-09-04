import express from "express";
import {
  isAdmin,
  isUserAuth,
} from "../middlewares/authorization.middlewares.js";
import * as orderController from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", isUserAuth, isAdmin, orderController.getAll);
router.get("/myPaidOrders", isUserAuth, orderController.getMyPaidOrders);

export default router;
