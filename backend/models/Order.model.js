const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  consumer: { type: mongoose.Schema.Types.ObjectId, ref: "Consumer", required: true }, 
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true }, // 🔹 Added farmer reference
      quantity: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true }, //total cost of the order 
  status: { 
    type: String, 
    enum: ["pending", "processed", "shipped", "delivered", "cancelled"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
