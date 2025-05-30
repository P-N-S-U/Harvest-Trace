const express = require("express");
const Product = require("../models/products.model");
const Farmer = require("../models/Farmers.model");
const { protect, farmerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/**  
 *  Route: Add a New Product 
 *  POST `/products/add`  
 */
router.post("/add", protect, farmerOnly, async (req, res) => {
  try {
    const { name, description, price, category, quantity, imageUrl } = req.body;

    // Check if user is a verified farmer
    const farmer = await Farmer.findById(req.user.id);
    if (!farmer || !farmer.verified) {
      return res.status(403).json({ message: "Only verified farmers can add products" });
    }

    // Create a new product
    const product = new Product({
      name,
      description,
      price,
      category,
      quantity,
      imageUrl,
      farmer: req.user.id
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**  
 *  Route: Get All Products  
 *  GET `/api/products`  
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all products and populate farmer details
    const products = await Product.find().populate("farmer", "name email phone");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**  
 *  Route: Get a Single Product by ID  
 *  GET `/api/products/:id`  
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("farmer", "name email phone");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**  
 *  Route: Update Product (Only Farmer Who Added It Can Edit)  
 *  PUT `/api/products/:id`  
 */

router.put("/:id", protect, async (req, res) => {
  try {
    const { name, description, price, category, quantity, imageUrl } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the logged-in farmer is the owner
    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You can only edit your own products" });
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;
    product.imageUrl = imageUrl || product.imageUrl;

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**  
 *  Route: Delete a Product (Only the Farmer Who Posted It Can Delete)  
 *  DELETE `/api/products/:id`  
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the logged-in farmer is the owner
    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this product" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
