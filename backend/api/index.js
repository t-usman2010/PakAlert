const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');

// Initialize express
const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));

// MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const client = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    });

    cachedDb = client;
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Models
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
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  })
);

// Routes
app.get('/api/alerts', async (req, res) => {
  try {
    await connectToDatabase();
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/alerts', async (req, res) => {
  try {
    await connectToDatabase();
    const alert = new Alert(req.body);
    await alert.save();
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    await connectToDatabase();
    const reports = await Report.find({ verified: true }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    await connectToDatabase();
    const report = new Report({ ...req.body, verified: false });
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export the Express API
module.exports = app;