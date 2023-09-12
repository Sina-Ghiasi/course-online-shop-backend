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
  if (!req.file)
    return res.status(400).send({ message: "Product image uploading failed" });

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    image:
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename,
    price: req.body.price,
    discount: req.body.discount,
  });

  const savedProduct = await product.save();
  if (!savedProduct)
    return res.status(400).send({ message: "Product creation failed" });

  res.status(200).send(savedProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const newProductData = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    discount: req.body.discount,
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
    return res.status(400).send({ message: "Product update failed" });

  res.status(200).send(updatedProduct);
});

export const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.productId);

  res.status(200).send(product);
});
