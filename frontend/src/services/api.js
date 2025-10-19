import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

// ☀️ Current Weather
export async function getWeather(city) {
  const res = await axios.get(`${API_BASE}/weather?city=${city}`);

  if (!res.data || !res.data.ok || !res.data.data) {
    throw new Error(res.data?.error || "Failed to fetch weather");
  }

  const raw = res.data.data;

  return {
    city: raw.name,
    temperature: raw.main?.temp,
    description: raw.weather?.[0]?.description || "N/A",
    humidity: raw.main?.humidity ?? null,
    windSpeed: raw.wind?.speed ?? null,
  };
}

// 🌤 Forecast (5-day)
export async function getForecast(city) {
  const res = await axios.get(`${API_BASE}/forecast?city=${city}`);

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

// 🚨 Alerts (Get All)
export async function getAlerts() {
  const res = await axios.get(`${API_BASE}/alerts`);
  return res.data;
}

// 🧾 Reports (Get All)
export async function getReports() {
  const res = await axios.get(`${API_BASE}/reports`);
  return res.data;
}

// 🌍 OneCall (current + hourly + daily)
export async function getOneCall(city) {
  const res = await axios.get(`${API_BASE}/onecall?city=${encodeURIComponent(city)}`);
  if (!res.data || !res.data.ok || !res.data.data)
    throw new Error(res.data?.error || "Failed to fetch onecall data");
  return res.data.data;
}

// 🕒 Time Machine (historical)
export async function getTimeMachine(city, dt) {
  const qs = `city=${encodeURIComponent(city)}${dt ? `&dt=${encodeInt(dt)}` : ""}`;
  const res = await axios.get(`${API_BASE}/timemachine?${qs}`);
  if (!res.data || !res.data.ok || !res.data.data)
    throw new Error(res.data?.error || "Failed to fetch timemachine data");
  return res.data.data;
}

// 💨 Air Quality (current)
export async function getAirPollution(city) {
  const res = await axios.get(`${API_BASE}/air_pollution?city=${encodeURIComponent(city)}`);
  if (!res.data || !res.data.ok || !res.data.data)
    throw new Error(res.data?.error || "Failed to fetch air pollution data");
  return res.data;
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

// 🗺️ Weather Map Tiles
export async function getWeatherMapTiles(layer = "clouds_new") {
  const res = await axios.get(`${API_BASE}/weather_map_tiles?layer=${encodeURIComponent(layer)}`);
  if (!res.data || !res.data.ok || !res.data.template)
    throw new Error(res.data?.error || "Failed to fetch weather map tiles template");
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
