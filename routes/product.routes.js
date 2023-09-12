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
import { uploadImage } from "../middlewares/upload.middlewares.js";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.post(
  "/create-product",
  isUserAuth,
  hasAdminAccess,
  uploadImage.single("image"),
  createProductValidation,
  productController.createProduct
);

router.post(
  "/update-product",
  isUserAuth,
  hasAdminAccess,
  uploadImage.single("image"),
  updateProductValidation,
  productController.updateProduct
);
router.get(
  "/number-of-products",
  isUserAuth,
  hasAdminAccess,
  productController.getNumberOfProducts
);
router.get("/:productId", productController.getProductById);
router.delete(
  "/:productId",
  isUserAuth,
  hasAdminAccess,
  productController.deleteProductById
);

export default router;
