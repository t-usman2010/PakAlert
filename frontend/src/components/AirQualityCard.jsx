import React from 'react';
import { Cloud } from 'lucide-react';

export default function AirQuality({ data, theme }) {
  const isLight = theme === 'light';
  if (!data) return null;

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'green';
    if (aqi <= 100) return 'yellow';
    if (aqi <= 150) return 'orange';
    if (aqi <= 200) return 'red';
    if (aqi <= 300) return 'purple';
    return 'maroon';
  };

  return (
    <div className={`rounded-2xl p-6 shadow-lg border ${
      isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-800/60 border-slate-600/50'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-gray-800' : 'text-white'}`}>Air Quality</h3>
      <div className="flex items-center justify-between">
        <Cloud size={32} className={isLight ? 'text-gray-400' : 'text-gray-200'} />
        <div className="text-right">
          <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-300'}`}>AQI</p>
          <p className={`font-semibold text-xl ${isLight ? 'text-gray-800' : 'text-white'}`} style={{ color: getAQIColor(data.aqi) }}>
            {data.aqi}
          </p>
          <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-300'}`}>{data.category}</p>
        </div>
      </div>
    </div>
  );
}
