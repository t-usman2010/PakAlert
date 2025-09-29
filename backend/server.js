require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const path = require("path");
const session = require("express-session");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions (for login)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Serve static files (login.html, index.html, JS, CSS)
app.use(express.static(path.join(__dirname, "views")));

// --- Auth Middleware ---
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  next();
}

// --- MongoDB Models ---
const Alert = mongoose.model(
  "Alert",
  new mongoose.Schema({
    title: String,
    severity: { type: String, enum: ["critical", "high", "medium", "low"] },
    description: String,
    actions: [String],
    createdAt: { type: Date, default: Date.now },
  })
);

const Report = mongoose.model(
  "Report",
  new mongoose.Schema({
    reporter: String,
    description: String,
    location: String,
    createdAt: { type: Date, default: Date.now },
  })
);

// --- Weather Cache (10 min TTL) ---
const cache = new Map();
const TTL = 600 * 1000;

async function fetchWeather(city) {
  const key = city.toLowerCase();
  const now = Date.now();

  if (cache.has(key) && now - cache.get(key).time < TTL) {
    return cache.get(key).data;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;
  const res = await axios.get(url);
  cache.set(key, { time: now, data: res.data });
  return res.data;
}

// --- Auth Routes ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    req.session.user = { username };
    return res.redirect("/");
  }
  res.redirect("/login.html?error=1");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login.html"));
});

// --- Protected Admin Portal ---
app.get("/", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// --- API Routes ---
// 🌤 Weather
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city || "Lahore";
    const data = await fetchWeather(city);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 🌦 5-Day Forecast (Daily Averages)
app.get("/api/forecast", async (req, res) => {
  try {
    const city = req.query.city || "Lahore";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHER_KEY}`;
    const { data } = await axios.get(url);

    // Group forecast data by date
    const grouped = {};
    data.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0]; // YYYY-MM-DD
      if (!grouped[date]) {
        grouped[date] = {
          min_temp: entry.main.temp_min,
          max_temp: entry.main.temp_max,
          humidities: [entry.main.humidity],
          winds: [entry.wind.speed],
        };
      } else {
        grouped[date].min_temp = Math.min(
          grouped[date].min_temp,
          entry.main.temp_min
        );
        grouped[date].max_temp = Math.max(
          grouped[date].max_temp,
          entry.main.temp_max
        );
        grouped[date].humidities.push(entry.main.humidity);
        grouped[date].winds.push(entry.wind.speed);
      }
    });

    // Convert grouped data → daily forecast
    const forecast = Object.keys(grouped).map((date) => {
      const { min_temp, max_temp, humidities, winds } = grouped[date];
      return {
        date,
        min_temp: min_temp.toFixed(1),
        max_temp: max_temp.toFixed(1),
        avg_humidity: (
          humidities.reduce((a, b) => a + b, 0) / humidities.length
        ).toFixed(1),
        avg_wind: (
          winds.reduce((a, b) => a + b, 0) / winds.length
        ).toFixed(1),
      };
    });

    res.json({ ok: true, city: data.city.name, forecast });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 🚨 Alerts
app.get("/api/alerts", async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.json(alerts);
});

app.post("/api/alerts", async (req, res) => {
  const alert = new Alert(req.body);
  await alert.save();
  io.emit("alert:new", alert);
  res.json(alert);
});

app.post("/api/alerts/update/:id", async (req, res) => {
  const { title, severity, description, actions } = req.body;
  const updated = await Alert.findByIdAndUpdate(
    req.params.id,
    { title, severity, description, actions: actions || [] },
    { new: true }
  );
  io.emit("alert:updated", updated);
  res.json(updated);
});

app.post("/api/alerts/delete/:id", async (req, res) => {
  await Alert.findByIdAndDelete(req.params.id);
  io.emit("alert:deleted", req.params.id);
  res.json({ success: true });
});

// 📢 Reports
app.get("/api/reports", async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
});

app.post("/api/reports", async (req, res) => {
  const report = new Report(req.body);
  await report.save();
  io.emit("report:new", report);
  res.json(report);
});

// --- Socket.IO ---
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);
});

// --- Start Server ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(process.env.PORT, () => {
      console.log(`✅ Server running at http://localhost:${process.env.PORT}`);
      console.log(
        `👉 Open http://localhost:${process.env.PORT}/login.html to access Admin Portal`
      );
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
