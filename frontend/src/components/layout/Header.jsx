import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  CloudRain, 
  Home, 
  FileText, 
  MapPin, 
  Menu, 
  X,
  Sun,
  Moon,
  Thermometer,
  Droplets
} from 'lucide-react';
import { Bell } from 'lucide-react';

const Header = ({ theme }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    {
      path: "/",
      name: "Dashboard",
      icon: Home,
      description: "Weather overview"
    },
    {
      path: "/alerts",
      name: "Alerts",
      icon: Bell,
      description: "Weather alerts"
    },
    {
      path: "/reports",
      name: "Reports",
      icon: FileText,
      description: "Community reports"
    }
  ];

  const weatherIcons = [
    { icon: Cloud, delay: 0 },
    { icon: CloudRain, delay: 0.2 },
    { icon: Thermometer, delay: 0.4 },
    { icon: Droplets, delay: 0.6 }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.header 
        className="relative z-50 mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`rounded-2xl p-6 backdrop-blur-sm border ${
            theme === "light" 
              ? "bg-white/80 border-white/50 shadow-lg" 
              : "bg-blue-900/30 border-blue-700/30 shadow-xl"
          }`}>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              {/* Logo and Title */}
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className={`p-3 rounded-xl ${
                  theme === "light" 
                    ? "bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg" 
                    : "bg-gradient-to-br from-blue-400 to-cyan-300 shadow-lg"
                }`}>
                  <Cloud className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
                    PakAlert
                  </h1>
                  <div className="flex items-center space-x-1 text-sm opacity-80">
                    <MapPin size={14} />
                    <span className={theme === "light" ? "text-gray-800" : "text-blue-100"}>
                      Pakistan Weather Monitoring With Real Time Alerts
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          isActive
                            ? theme === "light"
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-blue-400 text-white shadow-md"
                            : theme === "light"
                            ? "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            : "text-blue-200 hover:bg-blue-800/30 hover:text-white"
                        }`}
                      >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMobileMenu}
                className={`md:hidden p-2 rounded-lg ${
                  theme === "light" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-blue-800/30 text-blue-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>

            {/* Weather Status Bar */}
            <motion.div 
              className={`flex items-center justify-between p-4 rounded-lg ${
                theme === "light" 
                  ? "bg-blue-50/80 border border-blue-100" 
                  : "bg-blue-800/20 border border-blue-700/20"
              }`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {weatherIcons.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: item.delay, type: "spring" }}
                    >
                      <item.icon 
                        size={20} 
                        className={theme === "light" ? "text-blue-500" : "text-blue-300"} 
                      />
                    </motion.div>
                  ))}
                </div>
                <div>
                  <span className={`text-sm font-medium ${
                    theme === "light" ? "text-blue-800" : "text-blue-100"
                  }`}>
                    Live Weather Updates
                  </span>
                  <div className="flex items-center space-x-2 text-xs opacity-80">
                    {theme === "light" ? (
                      <>
                        <Sun size={12} className="text-yellow-500" />
                        <span className="text-gray-600">
                          Light Mode
                        </span>
                      </>
                    ) : (
                      <>
                        <Moon size={12} className="text-blue-300" />
                        <span className="text-blue-300">Dark Mode</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Time */}
              <div className={`text-sm font-medium ${
                theme === "light" ? "text-gray-800" : "text-blue-100"
              }`}>
                {new Date().toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                onClick={toggleMobileMenu}
              />
              
              {/* Menu Panel */}
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ type: "spring", damping: 25 }}
                className={`fixed top-24 right-4 w-64 rounded-2xl p-4 z-50 shadow-2xl md:hidden ${
                  theme === "light" 
                    ? "bg-white/95 backdrop-blur-sm" 
                    : "bg-blue-900/95 backdrop-blur-sm"
                }`}
              >
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.path}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Link
                          to={item.path}
                          onClick={toggleMobileMenu}
                          className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                            isActive
                              ? theme === "light"
                                ? "bg-blue-500 text-white"
                                : "bg-blue-400 text-white"
                              : theme === "light"
                              ? "text-gray-700 hover:bg-blue-50"
                              : "text-blue-200 hover:bg-blue-800/30"
                          }`}
                        >
                          <item.icon size={20} />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className={`text-xs ${
                              isActive ? "text-white/80" : theme === "light" ? "text-gray-500" : "text-blue-300/80"
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Mobile Menu Footer */}
                <motion.div 
                  className={`mt-4 pt-4 border-t ${
                    theme === "light" ? "border-gray-200" : "border-blue-700/30"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className={`text-xs text-center ${
                    theme === "light" ? "text-gray-500" : "text-blue-300/70"
                  }`}>
                    PakWeather v1.0.0 © 2025
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
    </>
  );
};

export default Header;