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
  const product = new Product({
    name: req.body.name,
    summary: req.body.summary,
    description: req.body.description,
    price: req.body.price,
    discount: req.body.discount,
    spotPlayerId: req.body.spotPlayerId,
  });
  if (req.file)
    product.image =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;

  const savedProduct = await product.save();
  if (!savedProduct)
    return res.status(400).send({ message: "ایجاد محصول موفق نبود" });

  res.status(200).send(savedProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const newProductData = {
    name: req.body.name,
    summary: req.body.summary,
    description: req.body.description,
    price: req.body.price,
    discount: req.body.discount,
    spotPlayerId: req.body.spotPlayerId,
  };
  if (req.file)
    newProductData.image =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;

  const updatedProduct = await Product.findOneAndUpdate(
    { _id: req.body.productId },
    newProductData,
    {
      new: true,
    }
  );

  if (!updatedProduct)
    return res.status(400).send({ message: "بروزرسانی محصول موفق نبود" });

  res.status(200).send(updatedProduct);
});

export const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.productId);

  res.status(200).send(product);
});

export const getNumberOfProducts = asyncHandler(async (req, res) => {
  const numberOfProducts = await Product.countDocuments();

  res.status(200).send(numberOfProducts.toString());
});
