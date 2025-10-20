import React from 'react';
import { Thermometer, Droplets, Wind, Eye } from 'lucide-react';

export default function CurrentWeatherDetails({ data, theme }) {
  const isLight = theme === 'light';

  if (!data) return null;

  return (
    <div className={`rounded-2xl p-6 shadow-lg border ${
      isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-800/60 border-slate-600/50'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-gray-800' : 'text-white'}`}>Current Weather Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Thermometer className={isLight ? 'text-orange-600' : 'text-orange-300'} size={20} />
          <div className="ml-2">
            <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-orange-300'}`}>Feels Like</p>
            <p className={`font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`}>{data.feelsLike?.toFixed(1)}°C</p>
          </div>
        </div>
        <div className="flex items-center">
          <Droplets className={isLight ? 'text-blue-600' : 'text-blue-300'} size={20} />
          <div className="ml-2">
            <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-blue-300'}`}>Humidity</p>
            <p className={`font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`}>{data.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center">
          <Wind className={isLight ? 'text-green-600' : 'text-green-300'} size={20} />
          <div className="ml-2">
            <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-green-300'}`}>Wind Speed</p>
            <p className={`font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`}>{data.windSpeed} m/s</p>
          </div>
        </div>
        <div className="flex items-center">
          <Eye className={isLight ? 'text-purple-600' : 'text-purple-300'} size={20} />
          <div className="ml-2">
            <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-purple-300'}`}>Pressure</p>
            <p className={`font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`}>{data.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
