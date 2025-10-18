import React from 'react';
import AlertsFeed from '../components/AlertsFeed';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const Heading = ({ title, subtitle, count = 0, theme = 'light' }) => {
  const isLight = theme === 'light';

  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="inline-flex items-center space-x-3"
      >
        <div className={`p-3 rounded-2xl shadow-md ${isLight ? 'bg-red-50' : 'bg-red-900/20'}`}>
          <Bell className={isLight ? 'text-red-600' : 'text-red-300'} size={40} />
        </div>
        <div>
          <h1 className={`text-6xl sm:text-4xl font-extrabold tracking-tight mb-1 ${
            isLight
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-500'
              : 'text-white'
          }`}>
            {title}
          </h1>
          <div className="flex items-center justify-center space-x-3">
            <p className={`text-l ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{subtitle}</p>
            <div className={`text-2xs font-semibold px-2 py-1 rounded-full ${
              isLight ? 'bg-white/80 text-red-700 border border-red-100' : 'bg-red-800/40 text-red-100 border border-red-700/30'
            }`}>
              {count} alert{count !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`mx-auto mt-4 h-1 rounded-full ${isLight ? 'bg-red-200/60 w-48' : 'bg-red-500/30 w-40'}`}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  );
};

const AlertsPage = ({ alerts = [], theme = 'light' }) => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-8xl mx-auto px-6 sm:px-6 lg:px-8">
        <Heading title="Weather Alerts" subtitle="Latest advisories for your area" count={alerts.length} theme={theme} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          <AlertsFeed alerts={alerts} theme={theme} />
        </motion.div>
      </div>
    </div>
  );
};

export default AlertsPage;
