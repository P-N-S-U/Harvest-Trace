const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Product name
  description: { type: String, required: true }, // Short description
  price: { type: Number, required: true }, // Price of product
  category: { type: String, required: true }, // Category (e.g., Vegetables, Fruits)
  quantity: { type: Number, required: true }, // Available stock
  imageUrl: { type: String, required: true }, // Image URL of product
  qrCodeUrl: { type: String, default: "" }, // QR Code for verification
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true } // Farmer who posted it
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);