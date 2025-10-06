import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Thermometer, Droplets, Wind, Calendar, ChevronRight } from "lucide-react";

function CustomTooltip({ active, payload, label, theme }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const avgTemp = ((data.minTemp + data.maxTemp) / 2).toFixed(1);
    const isLight = theme === "light";

    return (
      <div className={`p-4 shadow-xl rounded-xl border backdrop-blur-sm text-sm ${
        isLight 
          ? "bg-white/95 border-gray-200 text-gray-700" 
          : "bg-slate-800/95 border-slate-600 text-slate-300"
      }`}>
        <div className={`flex items-center mb-2 ${
          isLight ? "text-gray-700" : "text-slate-300"
        }`}>
          <Calendar size={16} className="mr-2 text-blue-500" />
          <p className="font-semibold">{label}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Thermometer size={16} className="mr-2 text-red-500" />
            <span className={isLight ? "text-gray-600" : "text-slate-400"}>Avg Temp: </span>
            <span className={`font-medium ml-1 ${
              isLight ? "text-gray-800" : "text-white"
            }`}>{avgTemp}°C</span>
          </div>
          <div className="flex items-center">
            <Droplets size={16} className="mr-2 text-blue-400" />
            <span className={isLight ? "text-gray-600" : "text-slate-400"}>Avg Humidity: </span>
            <span className={`font-medium ml-1 ${
              isLight ? "text-gray-800" : "text-white"
            }`}>{data.avgHumidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind size={16} className="mr-2 text-green-500" />
            <span className={isLight ? "text-gray-600" : "text-slate-400"}>Avg Wind: </span>
            <span className={`font-medium ml-1 ${
              isLight ? "text-gray-800" : "text-white"
            }`}>{data.avgWind} m/s</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function ForecastChart({ data, theme }) {
  // Custom tick formatter for XAxis to show abbreviated day names
  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isLight = theme === "light";

  return (
    <div className={`shadow-sm rounded-2xl p-6 border backdrop-blur-sm ${
      isLight 
        ? "bg-white/95 border-gray-200" 
        : "bg-slate-800/60 border-slate-600/50"
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${
          isLight ? "text-gray-800" : "text-white"
        }`}>
          5-Day Forecast
        </h2>
        <div className={`flex items-center text-sm ${
          isLight ? "text-gray-600" : "text-slate-400"
        }`}>
          <span className="flex items-center mr-4">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            Max Temp
          </span>
          <span className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            Min Temp
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isLight ? "#f0f0f0" : "#374151"} 
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: isLight ? '#6b7280' : '#9ca3af', 
              fontSize: 12 
            }}
          />
          <YAxis 
            unit="°C" 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: isLight ? '#6b7280' : '#9ca3af', 
              fontSize: 12 
            }}
            width={35}
          />

          <Tooltip content={<CustomTooltip theme={theme} />} />

          {/* Max temp line */}
          <Line
            type="monotone"
            dataKey="maxTemp"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ 
              r: 5, 
              strokeWidth: 2, 
              stroke: '#ef4444', 
              fill: isLight ? '#fff' : '#1f2937'
            }}
            activeDot={{ 
              r: 7, 
              stroke: '#ef4444', 
              strokeWidth: 2, 
              fill: isLight ? '#fff' : '#1f2937'
            }}
            name="Max Temp"
          />
          
          {/* Min temp line */}
          <Line
            type="monotone"
            dataKey="minTemp"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ 
              r: 5, 
              strokeWidth: 2, 
              stroke: '#3b82f6', 
              fill: isLight ? '#fff' : '#1f2937'
            }}
            activeDot={{ 
              r: 7, 
              stroke: '#3b82f6', 
              strokeWidth: 2, 
              fill: isLight ? '#fff' : '#1f2937'
            }}
            name="Min Temp"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className={`flex items-center justify-center mt-4 text-sm ${
        isLight ? "text-gray-500" : "text-slate-400"
      }`}>
        <ChevronRight size={16} className="mr-1 transform rotate-90" />
        <span>Hover over data points for detailed information</span>
      </div>
    </div>
  );
}