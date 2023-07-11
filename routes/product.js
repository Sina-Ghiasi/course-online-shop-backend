import express from "express";
import asyncHandler from "express-async-handler";
import Product from "../models/product.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.json(products);
  })
);
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
  })
);

export default router;
