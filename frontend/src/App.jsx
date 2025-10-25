import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Cloud, CloudRain, CloudSnow, Star, Loader, RefreshCw } from "lucide-react";
import {
  getAlerts,
  getReports,
  getWeather,
  getForecast,
  getAirPollution,
  createReport
} from "./services/api";
import useSocket from "./hooks/useSocket";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import ReportsPage from "./pages/ReportsPage";
import AlertsPage from "./pages/AlertsPage";

// Enhanced Background Component with better contrast
const AnimatedBackground = ({ theme }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const lightElements = [
    { icon: Sun, size: 120, top: "5%", left: "10%", delay: 0, color: "text-amber-500/20" },
    { icon: Cloud, size: 80, top: "15%", left: "80%", delay: 0.3, color: "text-slate-500/15" },
    { icon: Cloud, size: 100, top: "70%", left: "5%", delay: 0.6, color: "text-slate-400/15" },
    { icon: CloudRain, size: 60, top: "85%", left: "75%", delay: 0.9, color: "text-blue-500/15" }
  ];

  const darkElements = [
    { icon: Moon, size: 100, top: "8%", left: "85%", delay: 0, color: "text-slate-200/10" },
    { icon: Star, size: 20, top: "20%", left: "15%", delay: 0.1, color: "text-blue-100/20" },
    { icon: Star, size: 15, top: "30%", left: "90%", delay: 0.2, color: "text-blue-100/25" },
    { icon: Star, size: 25, top: "60%", left: "10%", delay: 0.3, color: "text-blue-100/15" },
    { icon: Star, size: 18, top: "75%", left: "80%", delay: 0.4, color: "text-blue-100/22" },
    { icon: Cloud, size: 70, top: "40%", left: "70%", delay: 0.5, color: "text-blue-400/8" }
  ];

  const elements = theme === "light" ? lightElements : darkElements;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Darker gradients for better contrast in light theme */}
      <div className={`absolute inset-0 transition-all duration-2000 ${
        theme === "light" 
          ? "bg-gradient-to-br from-slate-100 via-blue-100 to-slate-50" 
          : "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
      }`} />
      
      {/* Subtle texture overlay for light theme */}
      {theme === "light" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-200/10 via-transparent to-transparent" />
      )}
      
      {/* Animated elements */}
      <AnimatePresence mode="wait">
        {elements.map((element, index) => (
          <motion.div
            key={`${theme}-${index}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -10, 0],
              rotate: theme === "light" ? [0, 2, 0] : 0
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              duration: theme === "light" ? 12 : 20,
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

      {/* Enhanced gradient orbs */}
      {theme === "light" ? (
        <>
          <motion.div
            animate={{ 
              opacity: [0.1, 0.15, 0.1],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-10 left-1/4 w-40 h-40 bg-amber-300/15 rounded-full filter blur-3xl"
          />
          <motion.div
            animate={{ 
              opacity: [0.08, 0.12, 0.08],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            className="absolute bottom-20 right-1/4 w-52 h-52 bg-blue-300/10 rounded-full filter blur-3xl"
          />
          <motion.div
            animate={{ 
              opacity: [0.05, 0.08, 0.05],
              scale: [0.8, 1, 0.8]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute top-1/2 left-1/2 w-60 h-60 bg-slate-300/5 rounded-full filter blur-3xl"
          />
        </>
      ) : (
        <>
          <motion.div
            animate={{ opacity: [0.03, 0.06, 0.03] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-20 right-20 w-4 h-4 bg-blue-200/15 rounded-full filter blur-sm"
          />
          <motion.div
            animate={{ opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute top-32 left-32 w-3 h-3 bg-blue-100/12 rounded-full filter blur-sm"
          />
          <motion.div
            animate={{ opacity: [0.05, 0.09, 0.05] }}
            transition={{ duration: 7, repeat: Infinity, delay: 2 }}
            className="absolute bottom-40 right-40 w-3 h-3 bg-indigo-200/10 rounded-full filter blur-sm"
          />
          <motion.div
            animate={{ 
              opacity: [0.02, 0.04, 0.02],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl"
          />
        </>
      )}
    </div>
  );
};

// Loading Screen Component
const LoadingScreen = ({ theme }) => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className={`fixed inset-0 z-50 flex items-center justify-center ${
      theme === "light" 
        ? "bg-gradient-to-br from-slate-100 via-blue-100 to-slate-50" 
        : "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    }`}
  >
    <motion.div
      animate={{ rotate: 360, scale: [1, 1.1, 1] }}
      transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
      className={`p-8 rounded-2xl backdrop-blur-sm border ${
        theme === "light" 
          ? "bg-white/95 border-slate-300 shadow-2xl" 
          : "bg-slate-800/60 border-blue-700/30 shadow-2xl"
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        <Loader size={48} className={theme === "light" ? "text-slate-700" : "text-blue-400"} />
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`font-medium ${theme === "light" ? "text-slate-800" : "text-slate-200"}`}
        >
          Loading Weather...
        </motion.p>
      </div>
    </motion.div>
  </motion.div>
);

export default function App() {
  const [city, setCity] = useState("Islamabad");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [airQuality, setAirQuality] = useState(null); // Air pollution data
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errorWeather, setErrorWeather] = useState(null);
  const [errorForecast, setErrorForecast] = useState(null);
  const [theme, setTheme] = useState("light");
  const [lastUpdate, setLastUpdate] = useState(null);
  const socket = useSocket();
  const location = useLocation();

  // System theme detection with media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on system preference
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for system theme changes
    const handleThemeChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // Enhanced data fetching with retry mechanism (now includes OneCall + AirQuality)
  const fetchWeatherData = async (retryCount = 0) => {
    setLoadingWeather(true);
    setLoadingForecast(true);
    
    try {
      const [weatherData, forecastData, airData] = await Promise.all([
        getWeather(city),
        getForecast(city),
        getAirPollution(city).catch((err) => { console.warn("AirPollution fetch failed:", err); return null; })
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setAirQuality(airData);
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
          getAlerts().then((a) => setAlerts(Array.isArray(a) ? a : (a || []))),
          getReports().then((r) => setReports(Array.isArray(r) ? r : (r || [])))
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

  // API-backed alert/report handlers (client-side state + server)
  const refreshAlerts = async () => {
    try {
      const a = await getAlerts();
      setAlerts(Array.isArray(a) ? a : (a || []));
    } catch (err) {
      console.warn("Failed to refresh alerts:", err);
    }
  };

  const refreshReports = async () => {
    try {
      const r = await getReports();
      setReports(Array.isArray(r) ? r : (r || []));
    } catch (err) {
      console.warn("Failed to refresh reports:", err);
    }
  };

  const handleCreateAlert = async (alertObj) => {
    try {
      const created = await createAlert(alertObj);
      // server returns alert object; prepend
      setAlerts(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Create alert failed:", err);
      throw err;
    }
  };

  const handleUpdateAlert = async (id, updateObj) => {
    try {
      const updated = await updateAlert(id, updateObj);
      setAlerts(prev => prev.map(a => a._id === updated._id ? updated : a));
      return updated;
    } catch (err) {
      console.error("Update alert failed:", err);
      throw err;
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      await deleteAlert(id);
      setAlerts(prev => prev.filter(a => a._id !== id));
      return true;
    } catch (err) {
      console.error("Delete alert failed:", err);
      throw err;
    }
  };

  const handleCreateReport = async (reportObj) => {
    try {
      const created = await createReport(reportObj);
      setReports(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Create report failed:", err);
      throw err;
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    fetchWeatherData();
    refreshAlerts();
    refreshReports();
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
    return <LoadingScreen theme={theme} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${
      theme === "light" 
        ? "text-slate-800 bg-transparent" 
        : "text-white bg-transparent"
    }`}>
      <AnimatedBackground theme={theme} />
      
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
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium backdrop-blur-sm border transition-all duration-300 ${
              theme === "light"
                ? "bg-white/95 border-slate-300 text-slate-800 hover:bg-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-slate-800/80 border-slate-600/50 text-slate-200 hover:bg-slate-800/90 shadow-lg hover:shadow-xl hover:scale-105"
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {loadingWeather || loadingForecast ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            <span className="text-sm">
              {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </button>
        </motion.div>
      )}

      <Header theme={theme} />
      
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
        airQuality={airQuality}
        alerts={alerts}
        reports={reports}
        loadingWeather={loadingWeather}
        loadingForecast={loadingForecast}
        theme={theme}
        onRetry={handleRefresh}
      />
                }
              />
              <Route 
                path="/reports" 
                element={
                  <ReportsPage 
                    theme={theme} 
                    reports={reports}
                    onReportSubmit={() => refreshReports()}
                    onCreateReport={handleCreateReport} // optional handler for create flow
                  />
                }
              />
              <Route
                path="/alerts"
                element={
                  <AlertsPage
                    theme={theme}
                    alerts={alerts}
                    
                  />
                }
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer theme={theme} lastUpdate={lastUpdate} />
    </div>
  );
}
