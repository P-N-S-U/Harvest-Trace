const express = require("express");
const Consumer = require("../models/Consumers.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { protect, consumerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Consumer Registration
router.post("/register", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging Log

    const { name, email, phone, password } = req.body;

    // Check for missing fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if consumer already exists
    let consumer = await Consumer.findOne({ email });
    if (consumer) {
      return res.status(400).json({ message: "Consumer already registered" });
    }

    // Create new consumer
    consumer = new Consumer({ name, email, phone, password });
    await consumer.save();

    res.status(201).json({ message: "Consumer registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 🔹 Consumer Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find consumer in database
    const consumer = await Consumer.findOne({ email });
    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, consumer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: consumer._id, email: consumer.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, consumer });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 🔹 Get Consumer Profile (Protected Route)
router.get("/profile", protect, consumerOnly, async (req, res) => {
  try {
    const consumer = await Consumer.findById(req.user.id).select("-password");
    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }
    res.json(consumer);
    console.log("Consumer Profile:", consumer); // Debugging Log
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

//----------------------CART ROUTES-----------------------

/** 📌 1️⃣ Save Cart to Backend on Logout */
router.post("/cart/save", protect, consumerOnly, async (req, res) => {
  try {
    const { cart } = req.body;
    const consumer = await Consumer.findById(req.user.id);

    if (!consumer) return res.status(404).json({ message: "Consumer not found" });

    consumer.cart = cart;
    await consumer.save();

    res.json({ message: "Cart saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/** 📌 3️⃣ Fetch Cart */
router.get("/cart", protect, consumerOnly, async (req, res) => {
  try {
     const consumer = await Consumer.findById(req.user.id)
      .populate({
        path: "cart.product",
        select: "name price imageUrl", // Ensure imageUrl is included
      });

    if (!consumer) return res.status(404).json({ message: "Consumer not found" });

    res.json(consumer.cart);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.post("/cart/add", protect, consumerOnly, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const consumer = await Consumer.findById(req.user.id);

    if (!consumer) return res.status(404).json({ message: "Consumer not found" });

    // Check if product is already in cart
    const existingItem = consumer.cart.find((item) => item.product.toString() === productId);

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      consumer.cart.push({ product: productId, quantity });
    }

    await consumer.save();
    res.json({ message: "Cart updated successfully", cart: consumer.cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


module.exports = router;
