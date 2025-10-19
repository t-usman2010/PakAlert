// server.js
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

// --- Config / defaults ---
const PORT = process.env.PORT ;
const MONGO_URI = process.env.MONGO_URI ;
const SESSION_SECRET = process.env.SESSION_SECRET ;
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

if (!OPENWEATHER_KEY) {
  console.warn("⚠️  OPENWEATHER_KEY is not set. Some endpoints will fail without it.");
}

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: SESSION_SECRET,
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

// --- Caching ---
const cache = new Map();
const TTL = 600 * 1000; // 10 minutes

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function cacheSet(key, data) {
  cache.set(key, { time: Date.now(), data });
}

// --- Helpers ---
async function geocodeCity(city) {
  // returns { lat, lon, name, country }
  if (!OPENWEATHER_KEY) throw new Error("OPENWEATHER_KEY not configured");
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city
  )}&limit=1&appid=${OPENWEATHER_KEY}`;
  const { data } = await axios.get(url);
  if (!data || !data.length) throw new Error(`Could not geocode city: ${city}`);
  return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, country: data[0].country };
}

// --- Weather fetch (current) ---
async function fetchWeather(city) {
  const key = `weather:${city.toLowerCase()}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  if (!OPENWEATHER_KEY) throw new Error("OPENWEATHER_KEY not configured");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${OPENWEATHER_KEY}`;

  const res = await axios.get(url);
  cacheSet(key, res.data);
  return res.data;
}

// --- OneCall fetch (current + minutely + hourly + daily + alerts) ---
async function fetchOneCallByCoords(lat, lon) {
  const key = `onecall:${lat},${lon}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  if (!OPENWEATHER_KEY) throw new Error("OPENWEATHER_KEY not configured");

  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_KEY}`;
  const { data } = await axios.get(url);
  cacheSet(key, data);
  return data;
}

// --- Routes ---

// Auth routes
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.user = { username };
    return res.redirect("/");
  }
  res.redirect("/login.html?error=1");
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login.html"));
});

// Protected admin portal
app.get("/", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// --- API Routes ---

// 🌤 Current Weather (cached)
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city || "Lahore";
    const data = await fetchWeather(city);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 🌦 5-Day Forecast (3-hour steps -> daily groups)
app.get("/api/forecast", async (req, res) => {
  try {
    const city = req.query.city || "Lahore";
    if (!OPENWEATHER_KEY) throw new Error("OPENWEATHER_KEY not configured");

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${OPENWEATHER_KEY}`;
    const { data } = await axios.get(url);

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
        grouped[date].min_temp = Math.min(grouped[date].min_temp, entry.main.temp_min);
        grouped[date].max_temp = Math.max(grouped[date].max_temp, entry.main.temp_max);
        grouped[date].humidities.push(entry.main.humidity);
        grouped[date].winds.push(entry.wind.speed);
      }
    });

    const forecast = Object.keys(grouped).map((date) => {
      const { min_temp, max_temp, humidities, winds } = grouped[date];
      return {
        date,
        min_temp: Number(min_temp).toFixed(1),
        max_temp: Number(max_temp).toFixed(1),
        avg_humidity: (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(1),
        avg_wind: (winds.reduce((a, b) => a + b, 0) / winds.length).toFixed(1),
      };
    });

    res.json({ ok: true, city: data.city.name, forecast });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- OneCall (current, minutely, hourly, daily, alerts) ---
app.get("/api/onecall", async (req, res) => {
  try {
    const city = req.query.city || "Lahore";
    const { lat, lon, name } = await geocodeCity(city);
    const data = await fetchOneCallByCoords(lat, lon);
    data.location = { name, lat, lon };
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- TimeMachine (historical) ---
// expects: city and optional dt (unix seconds). If dt not provided, defaults to 24h ago.
app.get("/api/timemachine", async (req, res) => {
  try {
    const city = req.query.city || "Lahore";
    const dt = parseInt(req.query.dt, 10) || Math.floor(Date.now() / 1000) - 24 * 3600;
    if (!OPENWEATHER_KEY) throw new Error("OPENWEATHER_KEY not configured");
    const { lat, lon, name } = await geocodeCity(city);

    const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&units=metric&appid=${OPENWEATHER_KEY}`;
    const { data } = await axios.get(url);
    data.location = { name, lat, lon, requested_dt: dt };
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- Air Pollution (current) ---
app.get("/api/air_pollution", async (req, res) => {
  try {
    const city = req.query.city || "Lahore";
    const cacheKey = `air:${city.toLowerCase()}`;
    const cached = cacheGet(cacheKey);
    if (cached) return res.json({ ok: true, data: cached });

    if (!OPENWEATHER_KEY) throw new Error("OPENWEATHER_KEY not configured");
    const { lat, lon, name } = await geocodeCity(city);
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}`;
    const { data } = await axios.get(url);
    cacheSet(cacheKey, data);
    res.json({ ok: true, location: { name, lat, lon }, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- Geocoding forward (city -> coords) ---
app.get("/api/geocode", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ ok: false, error: "city query required" });
    if (!OPENWEATHER_KEY) throw new Error("OPENWEATHER_KEY not configured");
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=5&appid=${OPENWEATHER_KEY}`;
    const { data } = await axios.get(url);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- Reverse geocode (lat,lon -> place) ---
app.get("/api/reverse_geocode", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ ok: false, error: "lat and lon required" });
    if (!OPENWEATHER_KEY) throw new Error("OPENWEATHER_KEY not configured");
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&limit=1&appid=${OPENWEATHER_KEY}`;
    const { data } = await axios.get(url);
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- Weather map tile template (client should request tiles directly) ---
app.get("/api/weather_map_tiles", (req, res) => {
  try {
    const layer = req.query.layer || "clouds_new";
    // Template note: client will need to fetch tiles with z/x/y and this appid param.
    const template = `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${OPENWEATHER_KEY}`;
    res.json({ ok: true, layer, template });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- Alerts CRUD (existing behavior) ---
app.get("/api/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/alerts", async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    io.emit("alert:new", alert);
    res.json(alert);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/alerts/update/:id", async (req, res) => {
  try {
    const { title, severity, description, actions } = req.body;
    const updated = await Alert.findByIdAndUpdate(
      req.params.id,
      { title, severity, description, actions: actions || [] },
      { new: true }
    );
    io.emit("alert:updated", updated);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/alerts/delete/:id", async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    io.emit("alert:deleted", req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- Reports CRUD (existing behavior) ---
app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post("/api/reports", async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    io.emit("report:new", report);
    res.json(report);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- Socket.IO ---
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// --- Start Server & Connect to Mongo ---
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`👉 Open http://localhost:${PORT}/login.html to access Admin Portal`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    // still try to start server if you want local dev without DB:
    server.listen(PORT, () => {
      console.log(`⚠️  Server running without DB at http://localhost:${PORT}`);
      console.log(`👉 Open http://localhost:${PORT}/login.html to access Admin Portal`);
    });
  });
