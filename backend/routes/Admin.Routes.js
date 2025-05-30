const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin.model");
const Farmer = require("../models/Farmers.model");
const Consumer = require("../models/Consumers.model");
const Order = require("../models/Order.model");
const Product = require("../models/products.model");
const QRCode = require("qrcode");
const generateCertificate = require("../utils/generateCertificate");
const fs = require("fs");
const path = require("path");

const {protect,adminOnly} = require("../middleware/authMiddleware");

const router = express.Router();

/**  
 *  Admin Login (Only One Admin Exists)  
 *  POST `/api/admins/login`  
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded admin email (Only one admin exists)
    const adminEmail = "admin@naturalfarm.com";

    // Check if the email matches the predefined admin
    if (email !== adminEmail) {        
      return res.status(403).json({ message: "Unauthorized access" });
    }
    

    // Fetch admin from DB
    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      return res.status(404).json({ message: "Admin account not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token for Admin
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Admin login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/approve/:id", protect, adminOnly, async (req, res) => {
  try {
    // Restrict access to only the hardcoded admin
    if (req.user.email !== "admin@naturalfarm.com") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Find the farmer
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    console.log("🔹 Farmer Found:", farmer);

    // Generate Certification PDF
    const certificateURL = await generateCertificate(farmer);
    console.log("📄 Certificate Generated:", certificateURL);

    // Generate QR Code linking to certification
    const qrCodeData = `https://yourwebsite.com${certificateURL}`;
    const qrCodePath = path.join(__dirname, `../qrcodes/${farmer._id}.png`);
    await QRCode.toFile(qrCodePath, qrCodeData);
    console.log("🔗 QR Code Generated:", qrCodePath);

    // Update farmer's profile
    farmer.verified = true;
    farmer.certificateURL = certificateURL;
    farmer.qrCodeURL = `/qrcodes/${farmer._id}.png`;
    await farmer.save();

    console.log("✅ Farmer Approved:", farmer);
    res.json({ message: "Farmer approved & certification issued", farmer });
  } catch (err) {
    console.error("🔥 Error Approving Farmer:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**  GET all pending farmers (Not Verified) */
router.get("/pending-farmers", protect, adminOnly, async (req, res) => {
  try {
    const pendingFarmers = await Farmer.find({ verified: false }).select("-password");
    res.json(pendingFarmers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/consumers", protect, adminOnly, async (req, res) => {
  try {
    const consumers = await Consumer.find().select("-password");
    res.json(consumers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalFarmers = await Farmer.countDocuments({});
    const verifiedFarmers = await Farmer.countDocuments({ verified: true });
    const totalConsumers = await Consumer.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const totalProducts = await Product.countDocuments({});

    res.json({
      totalFarmers,
      verifiedFarmers,
      totalConsumers,
      totalOrders,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;



// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const FarmerProfile = () => {
//   const { farmerId } = useParams();
//   const [farmer, setFarmer] = useState(null);

//   useEffect(() => {
//     axios.get(`http://localhost:5000/api/farmers/verify/${farmerId}`)
//       .then(response => setFarmer(response.data))
//       .catch(error => console.error("Error fetching farmer details", error));
//   }, [farmerId]);

//   if (!farmer) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>{farmer.name}'s Certification</h2>
//       {farmer.verified ? (
//         <>
//           <p>Status: ✅ Verified</p>
//           <a href={farmer.certificateURL} target="_blank" rel="noopener noreferrer">Download Certificate</a>
//           <img src={farmer.qrCodeURL} alt="QR Code for verification" />
//         </>
//       ) : (
//         <p>Status: ❌ Not Verified</p>
//       )}
//     </div>
//   );
// };

// export default FarmerProfile;
