const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

module.exports = (io) => {
  // Get all alerts
  router.get("/", async (req, res) => {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  });

  // Add alert
  router.post("/", async (req, res) => {
    const alert = new Alert(req.body);
    await alert.save();
    io.emit("alert:new", alert);
    res.json(alert);
  });

  // Update alert
  router.post("/update/:id", async (req, res) => {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.emit("alert:updated", alert);
    res.json(alert);
  });

  // Delete alert
  router.post("/delete/:id", async (req, res) => {
    await Alert.findByIdAndDelete(req.params.id);
    io.emit("alert:deleted", req.params.id);
    res.json({ success: true });
  });

  return router;
};
