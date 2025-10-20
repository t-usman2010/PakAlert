import React from 'react';
import { motion } from 'framer-motion';
import CitySearch from '../components/CitySearch';
import WeatherCard from '../components/WeatherCard';
import ForecastChart from '../components/ForecastChart';
import CurrentWeatherDetails from '../components/CurrentWeatherdetails';
import AirQuality from '../components/AirQualityCard';
import { Cloud, CloudRain, Sun, AlertTriangle, RefreshCw } from 'lucide-react';

// --- Skeletons ---
const WeatherCardSkeleton = ({ theme }) => (
  <div className={`rounded-2xl p-6 shadow-lg border ${
    theme === "dark" 
      ? "bg-slate-800/60 border-slate-600/50" 
      : "bg-white/95 border-slate-200"
  }`}>
    <div className="animate-pulse">
      <div className={`h-7 rounded-full mb-4 ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} style={{ width: '60%' }}></div>
      <div className={`h-12 rounded-full mb-6 ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} style={{ width: '40%' }}></div>
      <div className="flex items-center justify-between">
        <div className={`h-20 w-20 rounded-full ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`}></div>
        <div className="space-y-2">
          <div className={`h-4 rounded-full ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} style={{ width: '80px' }}></div>
          <div className={`h-4 rounded-full ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} style={{ width: '60px' }}></div>
          <div className={`h-4 rounded-full ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} style={{ width: '70px' }}></div>
        </div>
      </div>
    </div>
  </div>
);

const ForecastSkeleton = ({ theme }) => (
  <div className={`rounded-2xl p-6 shadow-lg border ${
    theme === "dark" 
      ? "bg-slate-800/60 border-slate-600/50" 
      : "bg-white/95 border-slate-200"
  }`}>
    <div className="animate-pulse">
      <div className={`h-6 rounded-full mb-6 ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} style={{ width: '40%' }}></div>
      <div className="flex justify-between overflow-x-auto">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="text-center space-y-2 flex-shrink-0 w-14">
            <div className={`h-3 rounded-full ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} style={{ width: '30px' }}></div>
            <div className={`h-10 w-10 rounded-full mx-auto ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`}></div>
            <div className={`h-3 rounded-full ${theme === "dark" ? "bg-slate-700" : "bg-slate-300"}`} style={{ width: '25px' }}></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Error and Empty States ---
const ErrorState = ({ message, theme, onRetry }) => (
  <motion.div 
    className={`rounded-2xl p-8 text-center border shadow-lg ${
      theme === "dark" 
        ? "bg-red-900/30 border-red-700/50" 
        : "bg-red-50/95 border-red-200"
    }`}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <AlertTriangle className={`mx-auto mb-4 ${theme === "dark" ? "text-red-400" : "text-red-500"}`} size={48} />
    <p className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-red-100" : "text-red-800"}`}>
      Unable to load data
    </p>
    <p className={`mb-4 ${theme === "dark" ? "text-red-200" : "text-red-700"}`}>{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
          theme === "dark" 
            ? "bg-red-600/30 text-red-100 hover:bg-red-600/40 border border-red-600/30" 
            : "bg-red-100 text-red-800 hover:bg-red-200 border border-red-200"
        }`}
      >
        <RefreshCw size={16} className="mr-2" />
        Try Again
      </button>
    )}
  </motion.div>
);

const EmptyState = ({ theme, type }) => {
  const getEmptyConfig = (type) => {
    switch (type) {
      case 'weather':
        return { icon: <Cloud className={theme === "dark" ? "text-blue-400" : "text-slate-600"} size={48} />, title: "No Weather Data", description: "Search for a city to see current weather conditions" };
      case 'forecast':
        return { icon: <CloudRain className={theme === "dark" ? "text-blue-400" : "text-slate-600"} size={48} />, title: "No Forecast Available", description: "Weather forecast will appear here once a city is selected" };
      case 'hourly':
        return { icon: <Sun className={theme === "dark" ? "text-yellow-400" : "text-yellow-600"} size={48} />, title: "No Hourly Data", description: "Hourly forecast will appear here once a city is selected" };
      case 'airQuality':
        return { icon: <Cloud className={theme === "dark" ? "text-green-400" : "text-green-600"} size={48} />, title: "No Air Quality Data", description: "Air quality info will appear once available" };
      default:
        return { icon: <Cloud size={48} />, title: "No Data", description: "Data will appear here once available" };
    }
  };

  const config = getEmptyConfig(type);

  return (
    <motion.div 
      className={`rounded-2xl p-8 text-center border shadow-lg ${
        theme === "dark" 
          ? "bg-slate-800/60 border-slate-600/50" 
          : "bg-white/95 border-slate-200"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-4">{config.icon}</div>
      <h3 className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-white" : "text-slate-800"}`}>{config.title}</h3>
      <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>{config.description}</p>
    </motion.div>
  );
};

// --- HomePage ---
const HomePage = ({
  city,
  setCity,
  weather,
  forecast,
  airQuality,
  loadingWeather = false,
  loadingForecast = false,
  loadingAirQuality = false,
  errorWeather,
  errorForecast,
  errorAirQuality,
  theme,
  onRetry
}) => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-slate-800"}`}>Weather Dashboard</h1>
          <p className={`text-lg ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>Real-time weather data and forecasts for any location</p>
        </motion.div>

        {/* City Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mb-12">
          <CitySearch onSearch={setCity} theme={theme} />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <motion.div className="lg:col-span-1 space-y-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            {/* Weather Card */}
            {loadingWeather ? <WeatherCardSkeleton theme={theme} /> :
             errorWeather ? <ErrorState message={errorWeather} theme={theme} onRetry={onRetry} /> :
             weather ? <WeatherCard city={city} data={weather} theme={theme} /> :
             <EmptyState theme={theme} type="weather" />}

            {/* Current Weather Details */}
            {weather ? <CurrentWeatherDetails data={weather} theme={theme} /> : null}
          </motion.div>

          {/* Right Column */}
          <motion.div className="lg:col-span-2 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
            
            {/* Forecast Chart */}
            {loadingForecast ? <ForecastSkeleton theme={theme} /> :
             errorForecast ? <ErrorState message={errorForecast} theme={theme} onRetry={onRetry} /> :
             forecast && forecast.length > 0 ? <ForecastChart data={forecast} theme={theme} /> :
             <EmptyState theme={theme} type="forecast" />}

             {/* Air Quality - Wider */}
            <div className="mb-6">
              {loadingAirQuality ? <WeatherCardSkeleton theme={theme} /> :
               errorAirQuality ? <ErrorState message={errorAirQuality} theme={theme} onRetry={onRetry} /> :
               airQuality ? <AirQuality data={airQuality} theme={theme} /> :
               <EmptyState theme={theme} type="airQuality" />}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;