import React from "react";
import { 
  MapPin, 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle, 
  Clock,
} from "lucide-react";

export default function WeatherCard({ city, data, theme }) {
  if (!data) return null;

  const isLight = theme === "light";

  // Function to get weather icon based on description
  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || '';
    
    if (desc.includes('sun') || desc.includes('clear')) {
      return <Sun className={isLight ? "text-yellow-500" : "text-yellow-400"} size={36} />;
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
      return <CloudRain className={isLight ? "text-blue-500" : "text-blue-400"} size={36} />;
    } else if (desc.includes('snow') || desc.includes('blizzard')) {
      return <CloudSnow className={isLight ? "text-blue-300" : "text-blue-300"} size={36} />;
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
      return <Cloud className={isLight ? "text-gray-500" : "text-gray-400"} size={36} />;
    } else if (desc.includes('drizzle')) {
      return <CloudDrizzle className={isLight ? "text-blue-400" : "text-blue-300"} size={36} />;
    } else {
      return <Cloud className={isLight ? "text-gray-400" : "text-gray-500"} size={36} />;
    }
  };

  // Function to get background gradient based on temperature and theme
  const getBackgroundGradient = (temp) => {
    if (temp === undefined || temp === null) {
      return isLight 
        ? 'from-blue-100 via-blue-50 to-cyan-100' 
        : 'from-blue-900/40 via-blue-800/30 to-cyan-900/40';
    }
    if (temp >= 30) {
      return isLight 
        ? 'from-orange-100 via-red-50 to-yellow-100' 
        : 'from-orange-900/40 via-red-900/30 to-yellow-900/40';
    }
    if (temp >= 20) {
      return isLight 
        ? 'from-yellow-100 via-orange-50 to-amber-100' 
        : 'from-yellow-900/40 via-orange-900/30 to-amber-900/40';
    }
    if (temp >= 10) {
      return isLight 
        ? 'from-green-100 via-emerald-50 to-cyan-100' 
        : 'from-green-900/40 via-emerald-900/30 to-cyan-900/40';
    }
    if (temp >= 0) {
      return isLight 
        ? 'from-cyan-100 via-blue-50 to-indigo-100' 
        : 'from-cyan-900/40 via-blue-900/30 to-indigo-900/40';
    }
    return isLight 
      ? 'from-blue-100 via-indigo-50 to-purple-100' 
      : 'from-blue-900/40 via-indigo-900/30 to-purple-900/40';
  };

  const temperature = data.temperature !== undefined ? data.temperature.toFixed(1) : "—";
  const feelsLike = data.feelsLike !== undefined ? data.feelsLike.toFixed(1) : "—";
  const gradientClass = getBackgroundGradient(data.temperature);

  return (
    <div className={`relative bg-gradient-to-br ${gradientClass} rounded-3xl shadow-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl backdrop-blur-sm border-2 overflow-hidden ${
      isLight ? "border-white/30" : "border-blue-500/20"
    }`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4">
          <Cloud className={isLight ? "text-gray-600" : "text-white"} size={80} />
        </div>
        <div className="absolute bottom-4 left-4">
          <Cloud className={isLight ? "text-gray-600" : "text-white"} size={60} />
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-2xl mr-3 ${
              isLight ? "bg-white/60" : "bg-slate-700/40"
            }`}>
              <MapPin className={isLight ? "text-red-500" : "text-red-400"} size={20} />
            </div>
            <div>
              <h2 className={`text-xl font-bold capitalize ${
                isLight ? "text-gray-900" : "text-white"
              }`}>
                {data.city || city}
              </h2>
              <p className={`text-sm mt-1 ${
                isLight ? "text-gray-600" : "text-blue-200"
              }`}>
                Current Weather
              </p>
            </div>
          </div>
          
          {/* Last Updated */}
          {data.lastUpdated && (
            <div className={`text-xs flex items-center ${
              isLight ? "text-gray-600" : "text-blue-300"
            }`}>
              <Clock size={12} className="mr-1" />
              {new Date(data.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          )}
        </div>

        {/* Main Weather Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-3xl mr-4 ${
              isLight ? "bg-white/70" : "bg-slate-700/50"
            }`}>
              {getWeatherIcon(data.description)}
            </div>
            <div>
              <p className={`text-5xl font-bold mb-1 ${
                isLight ? "text-gray-800" : "text-white"
              }`}>
                {temperature}°C
              </p>
              <p className={`capitalize text-lg font-medium ${
                isLight ? "text-gray-700" : "text-blue-200"
              }`}>
                {data.description || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className={`mt-4 flex items-center justify-between text-xs ${
          isLight ? "text-gray-600" : "text-gray-400"
        }`}>
          <span>Real-time data</span>
          <span>•</span>
          <span>Auto-refresh</span>
          <span>•</span>
          <span>Local time</span>
        </div>
      </div>
    </div>
  );
}