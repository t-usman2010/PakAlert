import React from 'react';
import { Clock, Sun, CloudRain, CloudSnow, CloudDrizzle } from 'lucide-react';
import dayjs from 'dayjs';

export default function HourlyForecast({ data, theme }) {
  const isLight = theme === 'light';

  if (!data || data.length === 0) return null;

  return (
    <div className={`rounded-2xl p-6 shadow-lg border ${
      isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-800/60 border-slate-600/50'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-gray-800' : 'text-white'}`}>Hourly Forecast</h3>
      <div className="flex overflow-x-auto space-x-4">
        {data.map((hour, idx) => {
          const temp = hour.temp !== undefined ? hour.temp.toFixed(1) : '—';
          const weatherDesc = hour.weather?.[0]?.description?.toLowerCase() || '';
          const time = hour.dt ? dayjs.unix(hour.dt).format('HH:mm') : hour.time || '—';

          const getIcon = () => {
            if (weatherDesc.includes('sun') || weatherDesc.includes('clear')) return <Sun size={24} className={isLight ? 'text-yellow-500' : 'text-yellow-400'} />;
            if (weatherDesc.includes('rain') || weatherDesc.includes('drizzle')) return <CloudRain size={24} className={isLight ? 'text-blue-500' : 'text-blue-400'} />;
            if (weatherDesc.includes('snow')) return <CloudSnow size={24} className={isLight ? 'text-blue-300' : 'text-blue-300'} />;
            if (weatherDesc.includes('cloud')) return <CloudDrizzle size={24} className={isLight ? 'text-gray-500' : 'text-gray-400'} />;
            return <CloudDrizzle size={24} className={isLight ? 'text-gray-400' : 'text-gray-500'} />;
          };

          return (
            <div key={idx} className="flex flex-col items-center min-w-[60px]">
              <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-blue-200'}`}>{time}</p>
              <div className="my-1">{getIcon()}</div>
              <p className={`text-sm font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`}>{temp}°C</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
