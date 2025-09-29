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

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const avgTemp = ((data.minTemp + data.maxTemp) / 2).toFixed(1);

    return (
      <div className="bg-white p-4 shadow-xl rounded-xl border border-gray-100 text-sm backdrop-blur-sm">
        <div className="flex items-center mb-2 text-gray-700">
          <Calendar size={16} className="mr-2 text-blue-500" />
          <p className="font-semibold">{label}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Thermometer size={16} className="mr-2 text-red-500" />
            <span className="text-gray-600">Avg Temp: </span>
            <span className="font-medium ml-1">{avgTemp}°C</span>
          </div>
          <div className="flex items-center">
            <Droplets size={16} className="mr-2 text-blue-400" />
            <span className="text-gray-600">Avg Humidity: </span>
            <span className="font-medium ml-1">{data.avgHumidity}%</span>
          </div>
          <div className="flex items-center">
            <Wind size={16} className="mr-2 text-green-500" />
            <span className="text-gray-600">Avg Wind: </span>
            <span className="font-medium ml-1">{data.avgWind} m/s</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function ForecastChart({ data }) {
  // Custom tick formatter for XAxis to show abbreviated day names
  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">5-Day Forecast</h2>
        <div className="flex items-center text-sm text-gray-500">
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
            stroke="#f0f0f0" 
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatXAxis}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            unit="°C" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            width={35}
          />

          <Tooltip content={<CustomTooltip />} />

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
              fill: '#fff' 
            }}
            activeDot={{ 
              r: 7, 
              stroke: '#ef4444', 
              strokeWidth: 2, 
              fill: '#fff' 
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
              fill: '#fff' 
            }}
            activeDot={{ 
              r: 7, 
              stroke: '#3b82f6', 
              strokeWidth: 2, 
              fill: '#fff' 
            }}
            name="Min Temp"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
        <ChevronRight size={16} className="mr-1 transform rotate-90" />
        <span>Hover over data points for detailed information</span>
      </div>
    </div>
  );
}