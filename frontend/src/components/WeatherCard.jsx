import React from "react";
import { Thermometer, Droplets, Wind, MapPin, Eye, Cloud, Sun, CloudRain, CloudSnow, CloudDrizzle } from "lucide-react";

export default function WeatherCard({ city, data }) {
  if (!data) return null;

  // Function to get weather icon based on description
  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || '';
    
    if (desc.includes('sun') || desc.includes('clear')) {
      return <Sun className="text-yellow-500" size={32} />;
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
      return <CloudRain className="text-blue-500" size={32} />;
    } else if (desc.includes('snow') || desc.includes('blizzard')) {
      return <CloudSnow className="text-blue-300" size={32} />;
    } else if (desc.includes('cloud') || desc.includes('overcast')) {
      return <Cloud className="text-gray-500" size={32} />;
    } else if (desc.includes('drizzle')) {
      return <CloudDrizzle className="text-blue-400" size={32} />;
    } else {
      return <Cloud className="text-gray-400" size={32} />;
    }
  };

  // Function to get background gradient based on temperature
  const getBackgroundGradient = (temp) => {
    if (temp === undefined || temp === null) return 'from-blue-100 to-blue-200';
    if (temp >= 30) return 'from-red-100 to-orange-200';
    if (temp >= 20) return 'from-yellow-100 to-orange-100';
    if (temp >= 10) return 'from-green-100 to-blue-100';
    if (temp >= 0) return 'from-blue-100 to-cyan-100';
    return 'from-cyan-100 to-blue-200';
  };

  const temperature = data.temperature !== undefined ? data.temperature.toFixed(1) : "—";
  const gradientClass = getBackgroundGradient(data.temperature);

  return (
    <div className={`bg-gradient-to-br ${gradientClass} rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl`}>
      {/* Header */}
      <div className="flex items-center justify-center mb-4">
        <MapPin className="text-gray-700 mr-2" size={18} />
        <h2 className="text-xl font-semibold text-gray-900 capitalize">
          {data.city || city}
        </h2>
      </div>

      {/* Weather Icon and Temperature */}
      <div className="flex items-center justify-center mb-4">
        <div className="mr-4">
          {getWeatherIcon(data.description)}
        </div>
        <div>
          <p className="text-5xl font-bold text-gray-800 mb-1">
            {temperature}°C
          </p>
          <p className="text-gray-600 capitalize text-sm font-medium">
            {data.description || "—"}
          </p>
        </div>
      </div>

      {/* Weather Details */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Droplets className="text-blue-600" size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500">Humidity</p>
              <p className="font-semibold text-gray-800">
                {data.humidity !== null ? `${data.humidity}%` : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <Wind className="text-green-600" size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500">Wind Speed</p>
              <p className="font-semibold text-gray-800">
                {data.windSpeed !== null ? `${data.windSpeed} m/s` : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Additional weather data if available */}
        {(data.feelsLike !== undefined || data.pressure !== undefined) && (
          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/30">
            {data.feelsLike !== undefined && (
              <div className="flex items-center justify-center">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <Thermometer className="text-orange-600" size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Feels Like</p>
                  <p className="font-semibold text-gray-800">
                    {data.feelsLike.toFixed(1)}°C
                  </p>
                </div>
              </div>
            )}

            {data.pressure !== undefined && (
              <div className="flex items-center justify-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Eye className="text-purple-600" size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Pressure</p>
                  <p className="font-semibold text-gray-800">
                    {data.pressure} hPa
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Last Updated */}
      {data.lastUpdated && (
        <div className="mt-4 text-xs text-gray-600 flex items-center justify-center">
          <Clock size={12} className="mr-1" />
          Updated {new Date(data.lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}