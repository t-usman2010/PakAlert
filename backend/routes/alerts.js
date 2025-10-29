const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const { validateAlert } = require("../middleware/validation");

module.exports = (io) => {
  // Get all alerts
  router.get("/", async (req, res) => {
    try {
      const alerts = await Alert.find().sort({ createdAt: -1 });
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts", details: error.message });
    }
  });

  // Add alert
  router.post("/", validateAlert, async (req, res) => {
    try {
      const alert = new Alert(req.body);
      await alert.save();
      io.emit("alert:new", alert);
      res.status(201).json(alert);
    } catch (error) {
      console.error("Error creating alert:", error);
      res.status(500).json({ error: "Failed to create alert", details: error.message });
    }
  });

  // Update alert
  router.post("/update/:id", validateAlert, async (req, res) => {
    try {
      const alert = await Alert.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );
      
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }

      io.emit("alert:updated", alert);
      res.json(alert);
    } catch (error) {
      console.error("Error updating alert:", error);
      res.status(500).json({ error: "Failed to update alert", details: error.message });
    }
  });

  // Delete alert
  router.post("/delete/:id", async (req, res) => {
    try {
      const alert = await Alert.findByIdAndDelete(req.params.id);
      
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }

      io.emit("alert:deleted", req.params.id);
      res.json({ message: "Alert deleted successfully" });
    } catch (error) {
      console.error("Error deleting alert:", error);
      res.status(500).json({ error: "Failed to delete alert", details: error.message });
    }
  });
    res.json({ success: true });
  };

  return router;
;
