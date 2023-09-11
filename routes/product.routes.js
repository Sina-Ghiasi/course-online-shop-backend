import express from "express";
import * as productController from "../controllers/product.controller.js";
import {
  createProductValidation,
  updateProductValidation,
} from "../middlewares/validations.middlewares.js";
import {
  hasAdminAccess,
  isUserAuth,
} from "../middlewares/authorization.middlewares.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:productId", productController.getProductById);
router.post(
  "/create-product",
  isUserAuth,
  hasAdminAccess,
  createProductValidation,
  productController.createProduct
);

router.post(
  "/update-product",
  isUserAuth,
  hasAdminAccess,
  updateProductValidation,
  productController.updateProduct
);

router.delete(
  "/:productId",
  isUserAuth,
  hasAdminAccess,
  productController.deleteProductById
);

export default router;
