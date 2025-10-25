const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

module.exports = (io) => {
  // Get all reports
  router.get("/", async (req, res) => {
    // Only return verified reports to public clients
    const reports = await Report.find({ verified: true }).sort({ createdAt: -1 });
    res.json(reports);
  });

  // Add report
  router.post("/", async (req, res) => {
    // Ensure newly created report is unverified by default
    const payload = Object.assign({}, req.body, { verified: false });
    const report = new Report(payload);
    await report.save();
    // notify admins/clients that a new (pending) report exists
    io.emit("report:created", report);
    res.json(report);
  });

  return router;
};
