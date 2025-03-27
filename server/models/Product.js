const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  productType: { type: String, required: true },
  validity: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  productMaterial: { type: String, default: "" },
});

module.exports = mongoose.model("Product", productSchema);
