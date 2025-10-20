import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// ☀️ Current Weather
export async function getWeather(city) {
  const res = await axios.get(`${API_BASE}/weather?city=${encodeURIComponent(city)}`);
  if (!res.data || !res.data.ok || !res.data.data) {
    throw new Error(res.data?.error || "Failed to fetch weather");
  }

  const raw = res.data.data;

  return {
    city: raw.name,
    temperature: raw.main?.temp,
    feelsLike: raw.main?.feels_like,
    pressure: raw.main?.pressure,
    description: raw.weather?.[0]?.description || "N/A",
    humidity: raw.main?.humidity ?? null,
    windSpeed: raw.wind?.speed ?? null,
    lastUpdated: raw.dt ? raw.dt * 1000 : null,
  };
}

// 🌤 Forecast (5-day)
export async function getForecast(city) {
  const res = await axios.get(`${API_BASE}/forecast?city=${encodeURIComponent(city)}`);
  if (!res.data || !res.data.ok || !res.data.forecast) {
    throw new Error(res.data?.error || "Failed to fetch forecast");
  }

  return res.data.forecast.map((day) => ({
    date: day.date,
    minTemp: parseFloat(day.min_temp),
    maxTemp: parseFloat(day.max_temp),
    avgHumidity: parseFloat(day.avg_humidity),
    avgWind: parseFloat(day.avg_wind),
  }));
}

// 🌍 OneCall (current + hourly + daily + alerts)
export async function getOneCall(city) {
  // OneCall endpoint removed from backend. This helper is no longer available.
  throw new Error('getOneCall removed: use getWeather + getForecast instead');
}

// 💨 Air Quality
export async function getAirPollution(city) {
  const res = await axios.get(`${API_BASE}/air_pollution?city=${encodeURIComponent(city)}`);
  if (!res.data || !res.data.ok || !res.data.data) {
    throw new Error(res.data?.error || "Failed to fetch air pollution data");
  }

  const raw = res.data.data;
  return {
    aqi: raw.list?.[0]?.main?.aqi,
    components: raw.list?.[0]?.components || {},
    location: res.data.location || {},
  };
}

// 🧭 Geocode (city → coords)
export async function geocodeCity(city) {
  const res = await axios.get(`${API_BASE}/geocode?city=${encodeURIComponent(city)}`);
  if (!res.data || !res.data.ok || !res.data.data)
    throw new Error(res.data?.error || "Failed to geocode city");
  return res.data.data;
}

// 📍 Reverse Geocode (coords → city)
export async function reverseGeocode(lat, lon) {
  const res = await axios.get(
    `${API_BASE}/reverse_geocode?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
  );
  if (!res.data || !res.data.ok || !res.data.data)
    throw new Error(res.data?.error || "Failed to reverse geocode coordinates");
  return res.data.data;
}

// 🚨 Alerts
export async function getAlerts() {
  const res = await axios.get(`${API_BASE}/alerts`);
  if (!res.data) throw new Error("Failed to fetch alerts");
  return res.data;
}

// 🧾 Reports
export async function getReports() {
  const res = await axios.get(`${API_BASE}/reports`);
  if (!res.data) throw new Error("Failed to fetch reports");
  return res.data;
}

// 📝 Create Report
export async function createReport(reportObj) {
  const res = await axios.post(`${API_BASE}/reports`, reportObj);
  if (!res.data || res.data?.ok === false)
    throw new Error(res.data?.error || "Failed to create report");
  return res.data;
}

// 🔢 Helper
function encodeInt(v) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return "";
  return n.toString();
}
