import React from 'react';
import { Thermometer, Droplets, Wind, Gauge, Sunrise, Sunset } from 'lucide-react';

export default function CurrentWeatherDetails({ data, theme }) {
  const isLight = theme === 'light';

  if (!data) return null;

  const weatherMetrics = [
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: `${data.feelsLike?.toFixed(1)}°C`,
      description: data.feelsLike > data.temperature ? 'Warmer than actual' : 'Cooler than actual',
      color: isLight ? 'text-orange-600' : 'text-orange-300',
      bgColor: isLight ? 'bg-orange-50' : 'bg-orange-900/20'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${data.humidity}%`,
      description: getHumidityLevel(data.humidity),
      color: isLight ? 'text-blue-600' : 'text-blue-300',
      bgColor: isLight ? 'bg-blue-50' : 'bg-blue-900/20'
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${data.windSpeed} m/s`,
      description: getWindDescription(data.windSpeed),
      color: isLight ? 'text-green-600' : 'text-green-300',
      bgColor: isLight ? 'bg-green-50' : 'bg-green-900/20'
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${data.pressure} hPa`,
      description: getPressureLevel(data.pressure),
      color: isLight ? 'text-purple-600' : 'text-purple-300',
      bgColor: isLight ? 'bg-purple-50' : 'bg-purple-900/20'
    }
  ];

  function getHumidityLevel(humidity) {
    if (humidity < 30) return 'Dry air';
    if (humidity < 60) return 'Comfortable';
    if (humidity < 80) return 'Moderate humidity';
    return 'High humidity';
  }

  function getWindDescription(speed) {
    if (speed < 2) return 'Calm';
    if (speed < 5) return 'Light breeze';
    if (speed < 10) return 'Moderate wind';
    if (speed < 15) return 'Strong wind';
    return 'Very strong wind';
  }

  function getPressureLevel(pressure) {
    if (pressure < 1000) return 'Low pressure';
    if (pressure < 1015) return 'Normal pressure';
    return 'High pressure';
  }

  return (
    <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 ${
      isLight 
        ? 'bg-gradient-to-br from-white to-blue-50/50 border-blue-100' 
        : 'bg-gradient-to-br from-slate-800 to-slate-700/80 border-slate-600'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
            Weather Details
          </h3>
          <p className={`text-sm mt-1 ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
            Essential atmospheric conditions
          </p>
        </div>
        <div className={`p-3 rounded-2xl ${
          isLight ? 'bg-blue-100/80' : 'bg-slate-700/60'
        }`}>
          <Thermometer size={24} className={isLight ? 'text-blue-600' : 'text-blue-300'} />
        </div>
      </div>

      {/* Weather Metrics Grid - 2x2 layout */}
      <div className="grid grid-cols-2 gap-4">
        {weatherMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`rounded-2xl p-4 border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              metric.bgColor
            } ${
              isLight 
                ? 'border-gray-100 hover:border-gray-200' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-xl ${
                isLight ? 'bg-white/80' : 'bg-slate-700/40'
              }`}>
                <metric.icon size={20} className={metric.color} />
              </div>
              <div className="text-right">
                <p className={`text-xs font-medium ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                  {metric.label}
                </p>
                <p className={`font-bold text-lg ${isLight ? 'text-gray-900' : 'text-white'}`}>
                  {metric.value}
                </p>
              </div>
            </div>
            <p className={`text-xs leading-relaxed ${
              isLight ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {metric.description}
            </p>
          </div>
        ))}
      </div>

      {/* Additional Info Bar */}
      {(data.sunrise || data.sunset) && (
        <div className={`mt-6 p-4 rounded-2xl ${
          isLight ? 'bg-gray-50/80' : 'bg-slate-700/40'
        }`}>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              {data.sunrise && (
                <div className="flex items-center space-x-2">
                  <Sunrise size={16} className={isLight ? 'text-orange-500' : 'text-orange-300'} />
                  <span className={isLight ? 'text-gray-700' : 'text-gray-200'}>Sunrise: {data.sunrise}</span>
                </div>
              )}
              {data.sunset && (
                <div className="flex items-center space-x-2">
                  <Sunset size={16} className={isLight ? 'text-purple-500' : 'text-purple-300'} />
                  <span className={isLight ? 'text-gray-700' : 'text-gray-200'}>Sunset: {data.sunset}</span>
                </div>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isLight ? 'bg-green-100 text-green-700' : 'bg-green-900/40 text-green-300'
            }`}>
              Live Data
            </div>
          </div>
        </div>
      )}
    </div>
  );
}