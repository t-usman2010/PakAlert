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

  // Add alert with geo-location
  router.post("/", validateAlert, async (req, res) => {
    try {
      // Geocode city if provided but no coordinates
      if (req.body.location && req.body.location.city && !req.body.location.coordinates) {
        try {
          const axios = require('axios');
          const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(req.body.location.city)}&limit=1&appid=${process.env.OPENWEATHER_KEY}`;
          const geoResponse = await axios.get(geocodeUrl);
          
          if (geoResponse.data && geoResponse.data.length > 0) {
            req.body.location.coordinates = {
              latitude: geoResponse.data[0].lat,
              longitude: geoResponse.data[0].lon
            };
            req.body.location.address = `${geoResponse.data[0].name}, ${geoResponse.data[0].country}`;
          }
        } catch (geoError) {
          console.warn("Geocoding failed:", geoError.message);
        }
      }

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
