import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, TrendingDown, Cloud, Droplets, Wind, Eye,
  ThermometerSun, Activity, AlertTriangle, Users, MapPin,
  Calendar, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';

const AnalyticsDashboard = ({ theme, weatherData, alerts, reports }) => {
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [timeRange, setTimeRange] = useState('week');

  // Calculate statistics
  const stats = {
    totalAlerts: alerts?.length || 0,
    criticalAlerts: alerts?.filter(a => a.severity === 'critical').length || 0,
    totalReports: reports?.length || 0,
    verifiedReports: reports?.filter(r => r.verified).length || 0,
    avgTemperature: weatherData?.main?.temp || 0,
    humidity: weatherData?.main?.humidity || 0,
    windSpeed: weatherData?.wind?.speed || 0,
    pressure: weatherData?.main?.pressure || 0
  };

  // Alert severity distribution data
  const alertSeverityData = [
    { name: 'Critical', value: alerts?.filter(a => a.severity === 'critical').length || 0, color: '#ef4444' },
    { name: 'High', value: alerts?.filter(a => a.severity === 'high').length || 0, color: '#f97316' },
    { name: 'Medium', value: alerts?.filter(a => a.severity === 'medium').length || 0, color: '#eab308' },
    { name: 'Low', value: alerts?.filter(a => a.severity === 'low').length || 0, color: '#22c55e' }
  ];

  // Mock historical data (in real app, this would come from backend)
  const historicalData = [
    { date: 'Mon', temp: 28, humidity: 65, wind: 12, reports: 5 },
    { date: 'Tue', temp: 30, humidity: 60, wind: 15, reports: 8 },
    { date: 'Wed', temp: 29, humidity: 70, wind: 10, reports: 6 },
    { date: 'Thu', temp: 27, humidity: 75, wind: 8, reports: 12 },
    { date: 'Fri', temp: 26, humidity: 80, wind: 14, reports: 10 },
    { date: 'Sat', temp: 25, humidity: 85, wind: 18, reports: 15 },
    { date: 'Sun', temp: 28, humidity: 70, wind: 12, reports: 7 }
  ];

  // Weather pattern radar data
  const radarData = [
    { metric: 'Temperature', value: (stats.avgTemperature / 50) * 100 },
    { metric: 'Humidity', value: stats.humidity },
    { metric: 'Wind Speed', value: (stats.windSpeed / 20) * 100 },
    { metric: 'Pressure', value: ((stats.pressure - 950) / 100) * 100 },
    { metric: 'Alerts', value: (stats.totalAlerts / 20) * 100 },
    { metric: 'Reports', value: (stats.totalReports / 50) * 100 }
  ];

  // Stat Card Component
  const StatCard = ({ icon: Icon, label, value, trend, trendValue, color }) => (
    <motion.div
      className={`rounded-xl p-6 border ${
        theme === 'dark'
          ? 'bg-slate-800/60 border-slate-700/50'
          : 'bg-white border-slate-200'
      } shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={20} className={color} />
            <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {label}
            </span>
          </div>
          <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {value}
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              {trend === 'up' ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trendValue}%
              </span>
              <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                vs last week
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Analytics Dashboard
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
            Comprehensive weather insights and statistics
          </p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === range
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={AlertTriangle}
          label="Total Alerts"
          value={stats.totalAlerts}
          trend="up"
          trendValue={12}
          color="text-red-500"
        />
        <StatCard
          icon={Users}
          label="Community Reports"
          value={stats.totalReports}
          trend="up"
          trendValue={24}
          color="text-blue-500"
        />
        <StatCard
          icon={ThermometerSun}
          label="Avg Temperature"
          value={`${stats.avgTemperature.toFixed(1)}°C`}
          trend="down"
          trendValue={3}
          color="text-orange-500"
        />
        <StatCard
          icon={Activity}
          label="Verified Reports"
          value={`${stats.verifiedReports}/${stats.totalReports}`}
          trend="up"
          trendValue={8}
          color="text-green-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Severity Distribution */}
        <motion.div
          className={`rounded-xl p-6 border ${
            theme === 'dark'
              ? 'bg-slate-800/60 border-slate-700/50'
              : 'bg-white border-slate-200'
          } shadow-lg`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <PieChartIcon size={20} />
            Alert Severity Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alertSeverityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {alertSeverityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weather Trends */}
        <motion.div
          className={`rounded-xl p-6 border ${
            theme === 'dark'
              ? 'bg-slate-800/60 border-slate-700/50'
              : 'bg-white border-slate-200'
          } shadow-lg`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <BarChart3 size={20} />
            Weekly Weather Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} name="Temperature (°C)" />
              <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} name="Humidity (%)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Community Activity and Weather Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community Activity */}
        <motion.div
          className={`rounded-xl p-6 border ${
            theme === 'dark'
              ? 'bg-slate-800/60 border-slate-700/50'
              : 'bg-white border-slate-200'
          } shadow-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <Users size={20} />
            Community Reports Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="reports" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Reports" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weather Pattern Radar */}
        <motion.div
          className={`rounded-xl p-6 border ${
            theme === 'dark'
              ? 'bg-slate-800/60 border-slate-700/50'
              : 'bg-white border-slate-200'
          } shadow-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <Activity size={20} />
            Weather Metrics Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <PolarAngleAxis dataKey="metric" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <PolarRadiusAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
              <Radar name="Current Status" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Metrics Bar Chart */}
      <motion.div
        className={`rounded-xl p-6 border ${
          theme === 'dark'
            ? 'bg-slate-800/60 border-slate-700/50'
            : 'bg-white border-slate-200'
        } shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          <Calendar size={20} />
          Weekly Weather Comparison
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
            <XAxis dataKey="date" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
            <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="temp" fill="#f97316" name="Temperature (°C)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="wind" fill="#06b6d4" name="Wind Speed (km/h)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Insights and Recommendations */}
      <motion.div
        className={`rounded-xl p-6 border ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-700/50'
            : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
        } shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          <Eye size={20} />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-500" size={20} />
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Community Engagement
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              24% increase in user reports this week, showing strong community participation.
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-orange-500" size={20} />
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Alert Activity
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              {stats.criticalAlerts} critical alerts issued. Stay updated with weather changes.
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="text-blue-500" size={20} />
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Weather Trends
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Temperature showing downward trend. Expect cooler conditions ahead.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
