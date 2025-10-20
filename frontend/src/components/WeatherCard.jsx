import React from "react";
import { Thermometer, Droplets, Wind, MapPin, Eye, Cloud, Sun, CloudRain, CloudSnow, CloudDrizzle, Clock } from "lucide-react";

export default function WeatherCard({ city, data, theme }) {
  if (!data) return null;

  const isLight = theme === "light";

  // Function to get weather icon based on description
  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || '';
    
    if (desc.includes('sun') || desc.includes('clear')) {
      return <Sun className={isLight ? "text-yellow-500" : "text-yellow-400"} size={32} />;
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
      return <CloudRain className={isLight ? "text-blue-500" : "text-blue-400"} size={32} />;
    } else if (desc.includes('snow') || desc.includes('blizzard')) {
      return <CloudSnow className={isLight ? "text-blue-300" : "text-blue-300"} size={32} />;
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
      return <Cloud className={isLight ? "text-gray-500" : "text-gray-400"} size={32} />;
    } else if (desc.includes('drizzle')) {
      return <CloudDrizzle className={isLight ? "text-blue-400" : "text-blue-300"} size={32} />;
    } else {
      return <Cloud className={isLight ? "text-gray-400" : "text-gray-500"} size={32} />;
    }
  };

  // Function to get background gradient based on temperature and theme
  const getBackgroundGradient = (temp) => {
    if (temp === undefined || temp === null) {
      return isLight ? 'from-blue-100 to-blue-200' : 'from-blue-900/40 to-blue-800/50';
    }
    if (temp >= 30) {
      return isLight ? 'from-red-100 to-orange-200' : 'from-red-900/40 to-orange-900/50';
    }
    if (temp >= 20) {
      return isLight ? 'from-yellow-100 to-orange-100' : 'from-yellow-900/40 to-orange-900/50';
    }
    if (temp >= 10) {
      return isLight ? 'from-green-100 to-blue-100' : 'from-green-900/40 to-blue-900/50';
    }
    if (temp >= 0) {
      return isLight ? 'from-blue-100 to-cyan-100' : 'from-blue-900/40 to-cyan-900/50';
    }
    return isLight ? 'from-cyan-100 to-blue-200' : 'from-cyan-900/40 to-blue-900/50';
  };

  const temperature = data.temperature !== undefined ? data.temperature.toFixed(1) : "—";
  const gradientClass = getBackgroundGradient(data.temperature);

  return (
    <div className={`bg-gradient-to-br ${gradientClass} rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl backdrop-blur-sm border ${
      isLight ? "border-white/50" : "border-blue-700/30"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-center mb-4">
        <MapPin className={isLight ? "text-gray-700" : "text-blue-200"} size={18} />
        <h2 className={`text-xl font-semibold capitalize ml-2 ${
          isLight ? "text-gray-900" : "text-white"
        }`}>
          {data.city || city}
        </h2>
      </div>

      {/* Weather Icon and Temperature */}
      <div className="flex items-center justify-center mb-4">
        <div className="mr-4">
          {getWeatherIcon(data.description)}
        </div>
        <div>
          <p className={`text-5xl font-bold mb-1 ${
            isLight ? "text-gray-800" : "text-white"
          }`}>
            {temperature}°C
          </p>
          <p className={`capitalize text-sm font-medium ${
            isLight ? "text-gray-600" : "text-blue-200"
          }`}>
            {data.description || "—"}
          </p>
        </div>
      </div>

      {/* Last Updated */}
      {data.lastUpdated && (
        <div className={`mt-4 text-xs flex items-center justify-center ${
          isLight ? "text-gray-600" : "text-blue-300"
        }`}>
          <Clock size={12} className="mr-1" />
          Updated {new Date(data.lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}