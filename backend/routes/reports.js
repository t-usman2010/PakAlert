const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const { verifyReport, checkDuplicateReport, calculateReporterTrustScore } = require("../middleware/reportVerification");

module.exports = (io) => {
  // Get all reports (verified and auto-verified)
  router.get("/", async (req, res) => {
    try {
      const reports = await Report.find({
        $or: [
          { verified: true },
          { autoVerified: true }
        ]
      }).sort({ createdAt: -1 });
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // Add report with automatic verification
  router.post("/", async (req, res) => {
    try {
      const reportData = { ...req.body };

      // Check for duplicates
      const duplicateCheck = await checkDuplicateReport({ ...reportData, ipAddress: req.ip }, Report);
      if (duplicateCheck.isDuplicate) {
        return res.status(429).json({ 
          error: "Duplicate report detected", 
          reason: duplicateCheck.reason 
        });
      }

      // Run automatic verification
      const verification = await verifyReport(reportData, req);

      // Calculate reporter trust score
      const trustScore = await calculateReporterTrustScore(req.ip, Report);

      // Adjust verification score based on reporter history
      if (trustScore > 70) {
        verification.score += 10; // Boost for trusted reporters
      } else if (trustScore < 30) {
        verification.score -= 10; // Penalty for untrusted reporters
      }

      // Create report with verification data
      const report = new Report({
        ...reportData,
        verified: false, // Manual verification still false
        autoVerified: verification.autoVerified,
        verificationScore: verification.score,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        weatherConditionAtTime: reportData.weatherConditionAtTime
      });

      await report.save();

      // Emit different events based on verification status
      if (verification.autoVerified) {
        io.emit("report:new", report); // Public feed
        io.emit("report:verified", report);
      } else if (verification.needsReview) {
        io.emit("report:pending", report); // Admin review needed
      } else {
        io.emit("report:flagged", report); // Likely fake, admin attention
      }

      res.status(201).json({
        report,
        verification: {
          status: verification.status,
          score: verification.score,
          autoVerified: verification.autoVerified,
          message: verification.autoVerified 
            ? "Report automatically verified!" 
            : verification.needsReview
            ? "Report submitted. Under review."
            : "Report flagged for review due to low verification score."
        }
      });
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  // Manual verification endpoint (admin only)
  router.patch("/:id/verify", async (req, res) => {
    try {
      const report = await Report.findByIdAndUpdate(
        req.params.id,
        { verified: true },
        { new: true }
      );
      
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }

      io.emit("report:verified", report);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to verify report" });
    }
  });

  // Get report statistics (admin only)
  router.get("/stats", async (req, res) => {
    try {
      const total = await Report.countDocuments();
      const verified = await Report.countDocuments({ verified: true });
      const autoVerified = await Report.countDocuments({ autoVerified: true });
      const pending = await Report.countDocuments({ 
        verified: false, 
        autoVerified: false,
        verificationScore: { $gte: 40 }
      });
      const flagged = await Report.countDocuments({ 
        verificationScore: { $lt: 40 }
      });

      res.json({
        total,
        verified,
        autoVerified,
        pending,
        flagged
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  return router;
};
