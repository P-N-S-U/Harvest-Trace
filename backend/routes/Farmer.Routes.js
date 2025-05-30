const express = require("express");
const Farmer = require("../models/Farmers.model");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const multer = require("multer");

// const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// 📌 Register a new farmer
router.post("/register", upload.array("documents", 5), async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging Log
    console.log("Uploaded Files:", req.files); // Check if files are received

    const { name, email, phone, address, password, latitude, longitude } = req.body;
    const documents = req.files.map(file => file.path); // Get file paths

    if (!name || !phone || !password || documents.length === 0 || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let farmer = await Farmer.findOne({ email });
    if (farmer) return res.status(400).json({ message: "Farmer already registered" });

    // Create new farmer with latitude and longitude included
    farmer = new Farmer({
      name,
      email,
      phone,
      password,
      address,
      documents,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null
    });
    
    await farmer.save();

    res.status(201).json({ message: "Farmer registered successfully, pending approval" });
  } catch (err) {
    console.error("Error:", err); // Log error
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if farmer exists
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: farmer._id, email: farmer.email, verified: farmer.verified },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.json({ message: "Login successful", token, farmer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
