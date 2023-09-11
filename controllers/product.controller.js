import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const allProducts = await Product.find();

  res.status(200).send(allProducts);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  res.status(200).send(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product(req.body);

  const savedProduct = await product.save();
  if (!savedProduct)
    return res.status(400).send({ message: "Product creation failed" });

  res.status(200).send(savedProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { productId, ...update } = req.body;

  const updateResult = await Product.updateOne({ _id: productId }, update);

  if (!updateResult.modifiedCount === 1)
    return res.status(400).send({ message: "Product update failed" });

  res.status(200).send(updateResult);
});

export const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.productId);

  res.status(200).send(product);
});
