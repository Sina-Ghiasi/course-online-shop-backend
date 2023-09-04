import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const allProducts = await Product.find();

  res.status(200).send(allProducts);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.status(200).send(product);
});
