import React from 'react';
import { Cloud, Wind, Eye, Activity } from 'lucide-react';

export default function AirQuality({ data, theme }) {
  const isLight = theme === 'light';
  if (!data) return null;

  // Subtract 1 from the backend value (if backend shows 3, display 2)
  const displayAqi = Math.max(1, data.aqi - 1);

  const getAQIColor = (aqi) => {
    const colors = {
      1: '#10b981', // Good - Green
      2: '#f59e0b', // Fair - Yellow  
      3: '#f97316', // Moderate - Orange
      4: '#ef4444', // Poor - Red
      5: '#8b5cf6'  // Very Poor - Purple
    };
    return colors[aqi] || '#6b7280';
  };

  const getAQILevel = (aqi) => {
    const levels = {
      1: 'Excellent',
      2: 'Good', 
      3: 'Moderate',
      4: 'Poor',
      5: 'Very Poor'
    };
    return levels[aqi] || 'Unknown';
  };

  const getAQIDescription = (aqi) => {
    const descriptions = {
      1: 'Perfect air quality, ideal for outdoor activities',
      2: 'Good air quality, great for most activities',
      3: 'Moderate conditions, acceptable for most people',
      4: 'Poor air quality, sensitive groups should take care',
      5: 'Very poor conditions, consider limiting outdoor time'
    };
    return descriptions[aqi] || 'Air quality data unavailable';
  };

  const aqiColor = getAQIColor(displayAqi);
  const aqiLevel = getAQILevel(displayAqi);
  const aqiDescription = getAQIDescription(displayAqi);

  return (
    <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 hover:shadow-2xl ${
      isLight 
        ? 'bg-gradient-to-br from-white to-blue-50/70 border-blue-100' 
        : 'bg-gradient-to-br from-slate-800 to-slate-700/80 border-slate-600'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-2xl ${
            isLight ? 'bg-blue-100/80' : 'bg-slate-700/60'
          }`}>
            <Cloud 
              size={24} 
              className={isLight ? 'text-blue-600' : 'text-blue-300'} 
            />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>
              Air Quality
            </h3>
            <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
              1-5 Scale
            </p>
          </div>
        </div>
        
        {/* AQI Badge */}
        <div 
          className="px-4 py-2 rounded-2xl text-white font-bold text-lg shadow-lg transition-transform duration-300 hover:scale-105"
          style={{ backgroundColor: aqiColor }}
        >
          {displayAqi}/5
        </div>
      </div>

      {/* AQI Level and Description */}
      <div className="mb-6">
        <h4 className={`text-sm font-semibold mb-2 ${isLight ? 'text-gray-700' : 'text-gray-200'}`}>
          {aqiLevel}
        </h4>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
          {aqiDescription}
        </p>
      </div>

      {/* Scale Indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-3">
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} className="flex flex-col items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                  displayAqi >= level ? 'text-white' : isLight ? 'text-gray-400' : 'text-gray-500'
                }`}
                style={{ 
                  backgroundColor: displayAqi >= level ? aqiColor : isLight ? '#e5e7eb' : '#4b5563'
                }}
              >
                {level}
              </div>
              <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                {getAQILevel(level)}
              </span>
            </div>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className={`w-full h-2 rounded-full ${isLight ? 'bg-gray-200' : 'bg-slate-600'}`}>
          <div 
            className="h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${((displayAqi - 1) / 4) * 100}%`,
              backgroundColor: aqiColor,
              maxWidth: '100%'
            }}
          />
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`flex items-center justify-center p-2 rounded-xl ${
        isLight ? 'bg-gray-50/80' : 'bg-slate-600/30'
      }`}>
        <Activity size={14} className="mr-2" style={{ color: aqiColor }} />
        <span className={`text-xs font-medium ${isLight ? 'text-gray-700' : 'text-gray-200'}`}>
          {data.category || aqiLevel} • Updated just now
        </span>
      </div>
    </div>
  );
}