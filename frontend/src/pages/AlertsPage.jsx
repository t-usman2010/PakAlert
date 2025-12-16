import React, { useState, useMemo } from 'react';
import AlertsFeed from '../components/AlertsFeed';
import { motion } from 'framer-motion';
import { Bell, Search, X } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Filter alerts based on search query and severity
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = 
        alert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.affectedAreas?.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;

      return matchesSearch && matchesSeverity;
    });
  }, [alerts, searchQuery, filterSeverity]);

  const isLight = theme === 'light';

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-8xl mx-auto px-6 sm:px-6 lg:px-8">
        <Heading title="Weather Alerts" subtitle="Latest advisories for your area" count={filteredAlerts.length} theme={theme} />

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.35 }}
          className="mb-6 space-y-4"
        >
          {/* Search Box */}
          <div className={`relative rounded-xl border backdrop-blur-sm ${
            isLight 
              ? 'bg-white/95 border-gray-200' 
              : 'bg-slate-800/60 border-slate-600/50'
          }`}>
            <div className="flex items-center px-4 py-3">
              <Search className={`mr-3 ${isLight ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
              <input
                type="text"
                placeholder="Search alerts by title, city, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 outline-none bg-transparent ${
                  isLight ? 'text-gray-800 placeholder-gray-500' : 'text-white placeholder-gray-400'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`p-1 rounded-lg hover:bg-opacity-50 transition ${
                    isLight ? 'hover:bg-gray-100' : 'hover:bg-slate-700'
                  }`}
                >
                  <X size={18} className={isLight ? 'text-gray-600' : 'text-gray-400'} />
                </button>
              )}
            </div>
          </div>

          {/* Severity Filter */}
          <div className="flex flex-wrap gap-2">
            {['all', 'critical', 'high', 'medium', 'low'].map(severity => (
              <button
                key={severity}
                onClick={() => setFilterSeverity(severity)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterSeverity === severity
                    ? isLight
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : isLight
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </button>
            ))}
          </div>

          {/* Results info */}
          {searchQuery || filterSeverity !== 'all' ? (
            <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Found <span className="font-semibold">{filteredAlerts.length}</span> alert{filteredAlerts.length !== 1 ? 's' : ''} 
              {searchQuery && ` matching "${searchQuery}"`}
              {filterSeverity !== 'all' && ` with ${filterSeverity} severity`}
            </p>
          ) : null}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          {filteredAlerts.length > 0 ? (
            <AlertsFeed alerts={filteredAlerts} theme={theme} />
          ) : (
            <div className={`rounded-xl shadow-lg border backdrop-blur-sm p-12 text-center ${
              isLight 
                ? 'bg-white/95 border-gray-200' 
                : 'bg-slate-800/60 border-slate-600/50'
            }`}>
              <Bell className={`mx-auto mb-4 ${isLight ? 'text-gray-400' : 'text-gray-600'}`} size={48} />
              <p className={`text-lg font-medium ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                No alerts found
              </p>
              <p className={`text-sm mt-2 ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AlertsPage;
