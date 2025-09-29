import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

export async function getWeather(city) {
  const res = await axios.get(`${API_BASE}/weather?city=${city}`);

  if (!res.data || !res.data.ok || !res.data.data) {
    throw new Error(res.data?.error || "Failed to fetch weather");
  }

  const raw = res.data.data; // <-- actual OpenWeather object

  return {
    city: raw.name,
    temperature: raw.main?.temp, // already in Celsius from backend
    description: raw.weather?.[0]?.description || "N/A",
    humidity: raw.main?.humidity ?? null,
    windSpeed: raw.wind?.speed ?? null,
  };
}

export async function getForecast(city) {
  const res = await axios.get(`${API_BASE}/forecast?city=${city}`);

  if (!res.data || !res.data.ok || !res.data.forecast) {
    throw new Error(res.data?.error || "Failed to fetch forecast");
  }

  // Backend sends simplified daily forecast
  return res.data.forecast.map((day) => ({
    date: day.date,
    minTemp: parseFloat(day.min_temp),
    maxTemp: parseFloat(day.max_temp),
    avgHumidity: parseFloat(day.avg_humidity),
    avgWind: parseFloat(day.avg_wind),
  }));
}

export async function getAlerts() {
  const res = await axios.get(`${API_BASE}/alerts`);
  return res.data;
}

export async function getReports() {
  const res = await axios.get(`${API_BASE}/reports`);
  return res.data;
}
