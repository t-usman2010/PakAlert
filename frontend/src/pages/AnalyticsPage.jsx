import React from 'react';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const AnalyticsPage = ({ theme, weatherData, alerts, reports }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        <AnalyticsDashboard
          theme={theme}
          weatherData={weatherData}
          alerts={alerts}
          reports={reports}
        />
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
