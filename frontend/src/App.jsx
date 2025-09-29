import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Cloud, CloudRain, CloudSnow, Star, Loader, RefreshCw } from "lucide-react";
import { getAlerts, getReports, getWeather, getForecast } from "./services/api";
import useSocket from "./hooks/useSocket";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ReportsPage from "./pages/ReportsPage";

// Enhanced Background Component with better readability
const AnimatedBackground = ({ timeOfDay }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dayElements = [
    { icon: Sun, size: 120, top: "5%", left: "10%", delay: 0, color: "text-yellow-300/10" },
    { icon: Cloud, size: 80, top: "15%", left: "80%", delay: 0.3, color: "text-blue-300/5" },
    { icon: Cloud, size: 100, top: "70%", left: "5%", delay: 0.6, color: "text-blue-200/5" },
    { icon: CloudRain, size: 60, top: "85%", left: "75%", delay: 0.9, color: "text-blue-400/8" }
  ];

  const nightElements = [
    { icon: Moon, size: 100, top: "8%", left: "85%", delay: 0, color: "text-blue-200/5" },
    { icon: Star, size: 20, top: "20%", left: "15%", delay: 0.1, color: "text-white/10" },
    { icon: Star, size: 15, top: "30%", left: "90%", delay: 0.2, color: "text-white/15" },
    { icon: Star, size: 25, top: "60%", left: "10%", delay: 0.3, color: "text-white/8" },
    { icon: Star, size: 18, top: "75%", left: "80%", delay: 0.4, color: "text-white/12" },
    { icon: Cloud, size: 70, top: "40%", left: "70%", delay: 0.5, color: "text-blue-400/5" }
  ];

  const elements = timeOfDay === "day" ? dayElements : nightElements;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Simplified background with better contrast */}
      <div className={`absolute inset-0 transition-all duration-2000 ${
        timeOfDay === "day" 
          ? "bg-gradient-to-br from-blue-50 via-cyan-50 to-white" 
          : "bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900"
      }`} />
      
      {/* Subtle animated elements */}
      <AnimatePresence mode="wait">
        {elements.map((element, index) => (
          <motion.div
            key={`${timeOfDay}-${index}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -10, 0],
              rotate: timeOfDay === "day" ? [0, 2, 0] : 0
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              duration: timeOfDay === "day" ? 12 : 20,
              delay: element.delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="absolute"
            style={{ top: element.top, left: element.left }}
          >
            <element.icon 
              size={element.size} 
              className={element.color} 
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Very subtle gradient orbs */}
      {timeOfDay === "day" ? (
        <>
          <motion.div
            animate={{ 
              opacity: [0.1, 0.15, 0.1],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-10 left-1/4 w-32 h-32 bg-yellow-200/10 rounded-full filter blur-3xl"
          />
          <motion.div
            animate={{ 
              opacity: [0.05, 0.1, 0.05],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 3 }}
            className="absolute bottom-20 right-1/4 w-48 h-48 bg-blue-200/5 rounded-full filter blur-3xl"
          />
        </>
      ) : (
        <>
          <motion.div
            animate={{ opacity: [0.02, 0.05, 0.02] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 right-20 w-3 h-3 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute top-32 left-32 w-2 h-2 bg-white/8 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.04, 0.07, 0.04] }}
            transition={{ duration: 7, repeat: Infinity, delay: 2 }}
            className="absolute bottom-40 right-40 w-2 h-2 bg-white/6 rounded-full"
          />
        </>
      )}
    </div>
  );
};

// Loading Screen Component
const LoadingScreen = ({ timeOfDay }) => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className={`fixed inset-0 z-50 flex items-center justify-center ${
      timeOfDay === "day" 
        ? "bg-gradient-to-br from-blue-50 to-cyan-50" 
        : "bg-gradient-to-br from-gray-900 to-blue-900"
    }`}
  >
    <motion.div
      animate={{ rotate: 360, scale: [1, 1.1, 1] }}
      transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
      className={`p-6 rounded-2xl ${
        timeOfDay === "day" 
          ? "bg-white/90 backdrop-blur-sm shadow-lg" 
          : "bg-blue-900/50 backdrop-blur-sm shadow-lg"
      }`}
    >
      <Loader size={48} className={timeOfDay === "day" ? "text-blue-600" : "text-blue-300"} />
    </motion.div>
  </motion.div>
);

export default function App() {
  const [city, setCity] = useState("Islamabad");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errorWeather, setErrorWeather] = useState(null);
  const [errorForecast, setErrorForecast] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [lastUpdate, setLastUpdate] = useState(null);
  const socket = useSocket();
  const location = useLocation();

  // Enhanced time of day detection with smooth transitions
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      const newTimeOfDay = (hour >= 6 && hour < 18) ? "day" : "night";
      setTimeOfDay(newTimeOfDay);
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Enhanced data fetching with retry mechanism
  const fetchWeatherData = async (retryCount = 0) => {
    setLoadingWeather(true);
    setLoadingForecast(true);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeather(city),
        getForecast(city),
      ]);
      
      setWeather(weatherData);
      setForecast(forecastData);
      setErrorWeather(null);
      setErrorForecast(null);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Weather/Forecast fetch error:", err);
      
      if (retryCount < 2) {
        setTimeout(() => fetchWeatherData(retryCount + 1), 2000);
        return;
      }
      
      setErrorWeather("Failed to fetch weather data. Please try again.");
      setErrorForecast("Failed to fetch forecast data. Please try again.");
    } finally {
      setLoadingWeather(false);
      setLoadingForecast(false);
    }
  };

  // Initial data load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchWeatherData(),
          getAlerts().then(setAlerts),
          getReports().then(setReports)
        ]);
      } catch (err) {
        console.error("Initial data load error:", err);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch data when city changes
  useEffect(() => {
    if (!loadingInitial) {
      fetchWeatherData();
    }
  }, [city]);

  // Real-time socket updates
  useEffect(() => {
    if (!socket) return;

    const handlers = {
      "alert:new": (alert) => setAlerts(prev => [alert, ...prev]),
      "alert:updated": (updated) => setAlerts(prev =>
        prev.map(a => a._id === updated._id ? updated : a)
      ),
      "alert:deleted": (id) => setAlerts(prev => prev.filter(a => a._id !== id)),
      "report:new": (report) => setReports(prev => [report, ...prev]),
      "weather:update": (update) => {
        if (update.city === city) {
          setWeather(update);
          setLastUpdate(new Date());
        }
      }
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.keys(handlers).forEach(event => {
        socket.off(event);
      });
    };
  }, [socket, city]);

  // Manual refresh function
  const handleRefresh = () => {
    fetchWeatherData();
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  if (loadingInitial) {
    return <LoadingScreen timeOfDay={timeOfDay} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${
      timeOfDay === "day" 
        ? "text-gray-900" 
        : "text-white"
    }`}>
      <AnimatedBackground timeOfDay={timeOfDay} />
      
      {/* Refresh Indicator */}
      {lastUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50"
        >
          <button
            onClick={handleRefresh}
            disabled={loadingWeather || loadingForecast}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm border ${
              timeOfDay === "day"
                ? "bg-white/90 border-gray-200 text-gray-700 hover:bg-white shadow-lg"
                : "bg-blue-900/70 border-blue-700/50 text-blue-100 hover:bg-blue-900/80 shadow-lg"
            } transition-all duration-200 disabled:opacity-50`}
          >
            {loadingWeather || loadingForecast ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            <span>
              {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </button>
        </motion.div>
      )}

      <Header timeOfDay={timeOfDay} />
      
      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <HomePage
                    city={city}
                    setCity={setCity}
                    weather={weather}
                    forecast={forecast}
                    alerts={alerts}
                    reports={reports}
                    loadingWeather={loadingWeather}
                    loadingForecast={loadingForecast}
                    errorWeather={errorWeather}
                    errorForecast={errorForecast}
                    timeOfDay={timeOfDay}
                    onRetry={handleRefresh}
                  />
                }
              />
              <Route 
                path="/reports" 
                element={
                  <ReportsPage 
                    timeOfDay={timeOfDay} 
                    reports={reports}
                    onReportSubmit={() => getReports().then(setReports)}
                  />
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer timeOfDay={timeOfDay} lastUpdate={lastUpdate} />
    </div>
  );
}