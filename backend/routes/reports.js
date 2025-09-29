const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

module.exports = (io) => {
  // Get all reports
  router.get("/", async (req, res) => {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  });

  // Add report
  router.post("/", async (req, res) => {
    const report = new Report(req.body);
    await report.save();
    io.emit("report:new", report);
    res.json(report);
  });

  return router;
};
