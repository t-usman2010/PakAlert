const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  verified: { type: Boolean, default: false },
  autoVerified: { type: Boolean, default: false },
  verificationScore: { type: Number, default: 0 },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
  weatherConditionAtTime: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);
