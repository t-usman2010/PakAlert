import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
} from "recharts";
import { Thermometer, Droplets, Wind, Calendar, ChevronRight, Sun, CloudRain } from "lucide-react";

function CustomTooltip({ active, payload, label, theme }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const avgTemp = ((data.minTemp + data.maxTemp) / 2).toFixed(1);
    const tempRange = (data.maxTemp - data.minTemp).toFixed(1);
    const isLight = theme === "light";

    return (
      <div className={`p-5 shadow-2xl rounded-2xl border-2 backdrop-blur-sm text-sm min-w-[200px] ${
        isLight 
          ? "bg-white/95 border-blue-100 text-gray-700" 
          : "bg-slate-800/95 border-slate-600 text-slate-300"
      }`}>
        <div className={`flex items-center mb-3 pb-2 border-b ${
          isLight ? "border-gray-100 text-gray-700" : "border-slate-600 text-slate-300"
        }`}>
          <Calendar size={18} className="mr-2 text-blue-500" />
          <div>
            <p className="font-bold text-base">{label}</p>
            <p className="text-xs opacity-75">{data.fullDate}</p>
          </div>
        </div>
        
        {/* Temperature Section */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center text-sm font-medium">
              <Thermometer size={16} className="mr-2 text-red-500" />
              Temperature
            </span>
            <span className={`font-bold text-lg ${
              isLight ? "text-gray-900" : "text-white"
            }`}>
              {avgTemp}°C
            </span>
          </div>
          <div className={`text-xs rounded-lg p-2 ${
            isLight ? "bg-red-50 text-red-700" : "bg-red-900/20 text-red-300"
          }`}>
            <div className="flex justify-between">
              <span>High: {data.maxTemp}°C</span>
              <span> Low: {data.minTemp}°C</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Droplets size={16} className="mr-2 text-blue-400" />
              Humidity
            </span>
            <span className={`font-semibold ${
              isLight ? "text-gray-800" : "text-white"
            }`}>{data.avgHumidity}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center">
              <Wind size={16} className="mr-2 text-green-500" />
              Wind
            </span>
            <span className={`font-semibold ${
              isLight ? "text-gray-800" : "text-white"
            }`}>{data.avgWind} m/s</span>
          </div>
        </div>

        {/* Weather Condition */}
        {data.condition && (
          <div className={`mt-3 pt-2 border-t flex items-center ${
            isLight ? "border-gray-100" : "border-slate-600"
          }`}>
            {data.condition.includes('rain') ? (
              <CloudRain size={14} className="mr-2 text-blue-400" />
            ) : (
              <Sun size={14} className="mr-2 text-yellow-500" />
            )}
            <span className="text-xs capitalize">{data.condition}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function ForecastChart({ data, theme }) {
  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isLight = theme === "light";

  // Calculate overall min and max for consistent YAxis domain
  const allTemps = data?.flatMap(d => [d.maxTemp, d.minTemp]) || [];
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);

  return (
    <div className={`shadow-xl rounded-3xl p-6 border-2 transition-all duration-300 ${
      isLight 
        ? "bg-gradient-to-br from-white to-blue-50/30 border-blue-100" 
        : "bg-gradient-to-br from-slate-800 to-slate-700/80 border-slate-600"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${
            isLight ? "text-gray-900" : "text-white"
          }`}>
            5-Day Forecast
          </h2>
          <p className={`text-sm mt-1 ${
            isLight ? "text-gray-600" : "text-gray-300"
          }`}>
            Temperature trends and weather conditions
          </p>
        </div>
        
        {/* Legend */}
        <div className={`flex items-center space-x-6 text-sm ${
          isLight ? "text-gray-600" : "text-slate-400"
        }`}>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-red-500 rounded-full mr-2"></div>
            <span>Max Temp</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-1 bg-blue-500 rounded-full mr-2"></div>
            <span>Min Temp</span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="maxTempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="minTempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isLight ? "#e5e7eb" : "#4b5563"} 
            vertical={false}
            opacity={0.5}
          />
          
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: isLight ? '#6b7280' : '#9ca3af', 
              fontSize: 13,
              fontWeight: 500
            }}
            padding={{ left: 20, right: 20 }}
          />
          
          <YAxis 
            domain={[Math.floor(minTemp - 1), Math.ceil(maxTemp + 1)]}
            axisLine={false}
            tickLine={false}
            tick={{ 
              fill: isLight ? '#6b7280' : '#9ca3af', 
              fontSize: 12 
            }}
            width={40}
            tickFormatter={(value) => `${value}°`}
          />

          <Tooltip content={<CustomTooltip theme={theme} />} />

          {/* Area for max temp */}
          <Area
            type="monotone"
            dataKey="maxTemp"
            stroke="none"
            fill="url(#maxTempGradient)"
            fillOpacity={1}
          />

          {/* Area for min temp */}
          <Area
            type="monotone"
            dataKey="minTemp"
            stroke="none"
            fill="url(#minTempGradient)"
            fillOpacity={1}
          />

          {/* Max temp line */}
          <Line
            type="monotone"
            dataKey="maxTemp"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ 
              r: 6, 
              strokeWidth: 3, 
              stroke: '#ef4444', 
              fill: isLight ? '#fff' : '#1f2937',
              strokeLinecap: 'round'
            }}
            activeDot={{ 
              r: 8, 
              stroke: '#ef4444', 
              strokeWidth: 3, 
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
              r: 6, 
              strokeWidth: 3, 
              stroke: '#3b82f6', 
              fill: isLight ? '#fff' : '#1f2937',
              strokeLinecap: 'round'
            }}
            activeDot={{ 
              r: 8, 
              stroke: '#3b82f6', 
              strokeWidth: 3, 
              fill: isLight ? '#fff' : '#1f2937'
            }}
            name="Min Temp"
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Interactive Hint */}
      <div className={`flex items-center justify-center mt-6 p-3 rounded-2xl text-sm ${
        isLight 
          ? "bg-blue-50/80 text-blue-700" 
          : "bg-blue-900/20 text-blue-300"
      }`}>
        <ChevronRight size={16} className="mr-2 transform rotate-90 animate-bounce" />
        <span>Hover over the chart for detailed forecast information</span>
      </div>

      {/* Summary Stats - centered */}
      <div className={`grid grid-cols-2 gap-4 mt-6 p-4 rounded-2xl text-center mx-auto max-w-md ${
        isLight ? "bg-gray-50/80" : "bg-slate-700/40"
      }`}>
        <div className="text-center">
          <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>Avg High</p>
          <p className={`font-bold text-lg ${isLight ? "text-red-600" : "text-red-400"}`}>
            {((data?.reduce((sum, day) => sum + day.maxTemp, 0) || 0) / (data?.length || 1)).toFixed(1)}°C
          </p>
        </div>
        <div className="text-center">
          <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>Avg Low</p>
          <p className={`font-bold text-lg ${isLight ? "text-blue-600" : "text-blue-400"}`}>
            {((data?.reduce((sum, day) => sum + day.minTemp, 0) || 0) / (data?.length || 1)).toFixed(1)}°C
          </p>
        </div>
      </div>
    </div>
  );
}