import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReportsPage from '../components/ReportsPage';
import { FileText, Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react';

const BackgroundPattern = ({ timeOfDay }) => {
  const getPatternConfig = () => {
    if (timeOfDay === "night") {
      return {
        gradient: "from-indigo-900/20 via-purple-900/10 to-blue-900/20",
        icons: [
          { icon: Cloud, size: 80, top: "10%", left: "5%", delay: 0 },
          { icon: CloudRain, size: 60, top: "20%", left: "85%", delay: 0.2 },
          { icon: CloudSnow, size: 70, top: "70%", left: "10%", delay: 0.4 },
          { icon: Cloud, size: 90, top: "80%", left: "80%", delay: 0.6 }
        ]
      };
    } else {
      return {
        gradient: "from-blue-50/40 via-cyan-50/30 to-sky-50/40",
        icons: [
          { icon: Sun, size: 100, top: "15%", left: "90%", delay: 0 },
          { icon: Cloud, size: 80, top: "25%", left: "8%", delay: 0.3 },
          { icon: CloudRain, size: 60, top: "75%", left: "85%", delay: 0.6 },
          { icon: Cloud, size: 70, top: "65%", left: "5%", delay: 0.9 }
        ]
      };
    }
  };

  const config = getPatternConfig();

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`}>
      <AnimatePresence>
        {config.icons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: timeOfDay === "night" ? 0.1 : 0.15,
              scale: 1,
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 8,
              delay: item.delay,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute"
            style={{ top: item.top, left: item.left }}
          >
            <item.icon 
              size={item.size} 
              className={timeOfDay === "night" ? "text-blue-300/30" : "text-blue-400/30"} 
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const ThemeTransitionOverlay = ({ timeOfDay }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={timeOfDay}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className={`fixed inset-0 z-50 pointer-events-none ${
        timeOfDay === "night" ? "bg-blue-900" : "bg-sky-200"
      }`}
    />
  </AnimatePresence>
);

const ReportsPageContainer = ({ timeOfDay }) => {
  return (
    <div className={`relative min-h-screen overflow-hidden ${
      timeOfDay === "night" 
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" 
        : "bg-gradient-to-br from-blue-50 via-cyan-50 to-white"
    }`}>
      {/* Background Pattern */}
      <BackgroundPattern timeOfDay={timeOfDay} />
      
      {/* Smooth Theme Transition Overlay */}
      <ThemeTransitionOverlay timeOfDay={timeOfDay} />
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.3 
        }}
        className="relative z-10"
      >
        <ReportsPage timeOfDay={timeOfDay} />
      </motion.div>

      {/* Floating Action Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="fixed bottom-8 right-8 z-20"
      >
        <div className={`p-3 rounded-full shadow-lg ${
          timeOfDay === "night" 
            ? "bg-blue-800/50 backdrop-blur-sm border border-blue-700/30" 
            : "bg-white/80 backdrop-blur-sm border border-white/50"
        }`}>
          <FileText className={
            timeOfDay === "night" ? "text-blue-200" : "text-blue-600"
          } size={24} />
        </div>
      </motion.div>

      {/* Decorative Corner Accents */}
      <div className={`fixed top-0 left-0 w-32 h-32 bg-gradient-to-br ${
        timeOfDay === "night" 
          ? "from-blue-600/20 to-purple-600/20" 
          : "from-blue-400/20 to-cyan-400/20"
      } rounded-br-full`}></div>
      
      <div className={`fixed bottom-0 right-0 w-48 h-48 bg-gradient-to-tl ${
        timeOfDay === "night" 
          ? "from-purple-600/15 to-blue-600/15" 
          : "from-cyan-400/15 to-blue-400/15"
      } rounded-tl-full`}></div>
    </div>
  );
};

export default ReportsPageContainer;