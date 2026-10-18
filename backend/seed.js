require("dotenv").config();
const mongoose = require("mongoose");
const Alert = require("./models/Alert");
const Report = require("./models/Report");

const MONGO_URI = process.env.MONGO_URI;

const alerts = [
  {
    title: "Heavy Rainfall Warning",
    severity: "high",
    description: "Heavy rainfall is expected across low-lying areas. Avoid unnecessary travel and keep emergency supplies ready.",
    actions: ["Avoid flooded roads", "Keep phones charged", "Follow local emergency instructions"],
    location: {
      city: "Lahore",
      coordinates: { latitude: 31.5204, longitude: 74.3587 },
      address: "Lahore, Punjab"
    },
    affectedAreas: ["Lahore", "Sheikhupura", "Kasur"]
  },
  {
    title: "Extreme Heat Advisory",
    severity: "critical",
    description: "Very high temperatures are expected during the afternoon. Stay hydrated and limit outdoor activity.",
    actions: ["Drink water regularly", "Avoid direct sunlight", "Check on vulnerable people"],
    location: {
      city: "Karachi",
      coordinates: { latitude: 24.8607, longitude: 67.0011 },
      address: "Karachi, Sindh"
    },
    affectedAreas: ["Karachi", "Thatta", "Hyderabad"]
  },
  {
    title: "Strong Wind Advisory",
    severity: "medium",
    description: "Strong winds may affect outdoor activities and travel. Secure loose objects around homes and businesses.",
    actions: ["Secure outdoor furniture", "Drive carefully", "Stay away from damaged power lines"],
    location: {
      city: "Islamabad",
      coordinates: { latitude: 33.6844, longitude: 73.0479 },
      address: "Islamabad, Islamabad Capital Territory"
    },
    affectedAreas: ["Islamabad", "Rawalpindi", "Murree"]
  }
];

const reports = [
  {
    reporter: "Ayesha Khan",
    location: "Gulberg, Lahore",
    description: "Water has accumulated on the main road near the market after continuous rainfall. Traffic is moving slowly.",
    coordinates: { latitude: 31.5102, longitude: 74.3441 },
    verified: true,
    autoVerified: false,
    verificationScore: 92,
    weatherConditionAtTime: { condition: "Heavy rain", temperature: 25 }
  },
  {
    reporter: "Hamza Ali",
    location: "Clifton, Karachi",
    description: "Visibility is reduced because of dust and strong winds near the coastal road. Motorists should use caution.",
    coordinates: { latitude: 24.8138, longitude: 67.0304 },
    verified: true,
    autoVerified: true,
    verificationScore: 84,
    weatherConditionAtTime: { condition: "Dusty", temperature: 34 }
  },
  {
    reporter: "Sana Ahmed",
    location: "Bahria Town, Rawalpindi",
    description: "Dark clouds and intermittent rain have started in the area. No flooding has been observed so far.",
    coordinates: { latitude: 33.5526, longitude: 73.1236 },
    verified: false,
    autoVerified: false,
    verificationScore: 58,
    weatherConditionAtTime: { condition: "Cloudy", temperature: 28 }
  }
];

async function seed() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not configured.");
  }

  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000
  });

  const alertTitles = alerts.map((alert) => alert.title);
  const reportLocations = reports.map((report) => report.location);

  const existingAlerts = await Alert.find({ title: { $in: alertTitles } }, { title: 1 });
  const existingReports = await Report.find({ location: { $in: reportLocations } }, { location: 1 });
  const existingAlertTitles = new Set(existingAlerts.map((alert) => alert.title));
  const existingReportLocations = new Set(existingReports.map((report) => report.location));

  const alertsToInsert = alerts.filter((alert) => !existingAlertTitles.has(alert.title));
  const reportsToInsert = reports.filter((report) => !existingReportLocations.has(report.location));

  if (alertsToInsert.length > 0) {
    await Alert.insertMany(alertsToInsert);
  }
  if (reportsToInsert.length > 0) {
    await Report.insertMany(reportsToInsert);
  }

  console.log(`Seed complete: added ${alertsToInsert.length} alerts and ${reportsToInsert.length} reports.`);
  console.log(`Skipped ${alerts.length - alertsToInsert.length} existing alerts and ${reports.length - reportsToInsert.length} existing reports.`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
