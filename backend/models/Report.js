const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);
