const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");

const router = express.Router();

const isValidObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  next();
};

router.post("/", async (req, res) => {
  const { name, productType, validity, phoneNumber, productMaterial } =
    req.body;

  if (!name || !productType || !validity || !phoneNumber || !productMaterial) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newProduct = new Product({
      name,
      productType,
      validity,
      phoneNumber,
      productMaterial,
    });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add product", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const dbProducts = await Product.find();

    const products = dbProducts.map((dbProduct) => ({
      id: dbProduct._id,
      name: dbProduct.name,
      productType: dbProduct.productType || "",
      validity: dbProduct.validity || "",
      phoneNumber: dbProduct.phoneNumber || "",
      productMaterial: dbProduct.productMaterial || "",
    }));

    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
});

router.put("/:id", isValidObjectId, async (req, res) => {
  const { name, productType, validity, phoneNumber, productMaterial } =
    req.body;

  if (!name || !productType || !validity || !phoneNumber || !productMaterial) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, productType, validity, phoneNumber, productMaterial },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: err.message });
  }
});

router.delete("/:id", isValidObjectId, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: err.message });
  }
});

module.exports = router;
