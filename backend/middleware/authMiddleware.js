const jwt = require("jsonwebtoken");
const Consumer = require("../models/Consumers.model");
const Farmer = require("../models/Farmers.model");
const Admin = require("../models/Admin.model");

const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    // Verify Token
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

    // Check if user exists as an Admin
    const admin = await Admin.findById(decoded.id);
    if (admin) {
      req.user = { id: admin._id, email: admin.email, role: "admin" };
      return next();
    }

    // Check if user exists as a Consumer
    const consumer = await Consumer.findById(decoded.id);
    if (consumer) {
      req.user = { id: consumer._id, email: consumer.email, role: "consumer" };
      return next();
    }

    // Check if user exists as a Farmer
    const farmer = await Farmer.findById(decoded.id);
    if (farmer) {
      req.user = { id: farmer._id, email: farmer.email, role: "farmer", verified: farmer.verified };
      return next();
    }

    return res.status(401).json({ message: "Unauthorized user" });

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🔹 Middleware to Allow Only Consumers
const consumerOnly = (req, res, next) => {
  if (req.user && req.user.role === "consumer") {
    next(); // Allow access
  } else {
    res.status(403).json({ message: "Access denied. Consumers only." });
  }
};

// 🔹 Middleware to Allow Only Farmers
const farmerOnly = (req, res, next) => {
  if (req.user && req.user.role === "farmer") {
    next(); // Allow access
  } else {
    res.status(403).json({ message: "Access denied. Farmers only." });
  }
};

//middleware to allow only admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Allow access
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { protect, consumerOnly, farmerOnly, adminOnly };
