const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  documents: [{ type: String, required: true }], // Array of file URLs
  verified: { type: Boolean, default: false },  // Admin approval status
  certificateURL: { type: String, default: "" }, // Digital certificate URL
  latitude: { type: Number, default: null }, // Coordinates for map
  longitude: { type: Number, default: null },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

// 🔹 Hash password before saving to database
farmerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Farmer", farmerSchema);
