const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  severity: { type: String, enum: ["critical", "high", "medium", "low"], required: true },
  description: { type: String },
  actions: [{ type: String }],
  location: {
    city: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    address: { type: String }
  },
  affectedAreas: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
