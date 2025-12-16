import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Github, 
  Mail, 
  MapPin, 
  Shield, 
  ExternalLink,
  Cloud,
  Thermometer,
  Droplets, 
  Instagram
} from 'lucide-react';

const Footer = ({ theme, lastUpdate }) => {
  const currentYear = new Date().getFullYear();
  const isLight = theme === "light";
  
  const footerLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/t-usman2010',
      icon: Github,
      description: 'View source code'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/t.usman.__.2k10/',
      icon: Instagram,
      description: 'Follow updates'
    },
    {
      name: 'Contact',
      href: 'mailto:t.usman36412@gmail.com',
      icon: Mail,
      description: 'Get in touch'
    }
  ];

  const weatherStats = [
    { icon: Thermometer, label: 'Cities', value: '50+' },
    { icon: Cloud, label: 'Updates', value: '24/7' },
    { icon: Droplets, label: 'Accuracy', value: '85%' },
    { icon: Shield, label: 'Secure', value: 'SSL' }
  ];

  return (
    <motion.footer 
      className={`mt-20 pt-16 pb-8 relative z-10 ${
        isLight 
          ? "bg-gradient-to-b from-white to-gray-50 border-t border-gray-200/50" 
          : "bg-gradient-to-b from-slate-800/50 to-slate-900 border-t border-blue-700/30"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Weather Stats - Enhanced */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {weatherStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`card text-center p-6 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 group cursor-default ${
                isLight 
                  ? "bg-gradient-to-br from-white to-gray-50 border-gray-200" 
                  : "bg-gradient-to-br from-slate-700/30 to-slate-800/30 border-slate-600/50"
              }`}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
            >
              <div className={`p-3 rounded-xl mx-auto mb-3 w-fit group-hover:scale-110 transition-transform ${
                isLight 
                  ? "bg-blue-100 group-hover:bg-blue-200" 
                  : "bg-blue-900/40 group-hover:bg-blue-800/60"
              }`}>
                <stat.icon 
                  size={24} 
                  className={`${
                    isLight ? "text-blue-600" : "text-blue-400"
                  }`} 
                />
              </div>
              <div className={`text-3xl font-bold mb-2 ${
                isLight ? "text-gray-900" : "text-white"
              }`}>
                {stat.value}
              </div>
              <div className={`text-sm font-medium ${
                isLight ? "text-gray-600" : "text-blue-300"
              }`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className={`h-px mb-12 ${
          isLight ? "bg-gray-200" : "bg-gradient-to-r from-transparent via-blue-700/30 to-transparent"
        }`} />

        {/* Links and Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-lg mr-3 ${
                isLight ? "bg-blue-100" : "bg-blue-900/30"
              }`}>
                <Cloud className={isLight ? "text-blue-600" : "text-blue-400"} size={24} />
              </div>
              <h3 className={`text-xl font-bold ${
                isLight ? "text-gray-900" : "text-white"
              }`}>
                PakWeather
              </h3>
            </div>
            <p className={`mb-4 ${
              isLight ? "text-gray-600" : "text-blue-200"
            }`}>
              Real-time weather monitoring and forecasting for Pakistan. 
              Accurate, reliable, and always up-to-date.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin size={14} className={isLight ? "text-gray-500" : "text-blue-300"} />
              <span className={isLight ? "text-gray-500" : "text-blue-300"}>
                Serving all major cities in Pakistan
              </span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <h4 className={`font-semibold mb-4 ${
              isLight ? "text-gray-900" : "text-white"
            }`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Weather Maps', 'Radar', 'Forecasts', 'Weather News'].map((link) => (
                <li key={link}>
                  <a href="https://www.msn.com/en-us/weather" className={`inline-flex items-center text-sm transition-colors hover:underline ${
                    isLight ? "text-blue-600 hover:text-blue-700" : "text-blue-300 hover:text-blue-200"
                  }`}>
                    {link}
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <h4 className={`font-semibold mb-4 ${
              isLight ? "text-gray-900" : "text-white"
            }`}>
              Connect With Us
            </h4>
            <div className="flex space-x-3 mb-4">
              {footerLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all border ${
                    isLight 
                      ? "bg-white/80 border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200" 
                      : "bg-blue-900/30 border-blue-700/50 text-blue-400 hover:bg-blue-800/40 hover:border-blue-600/50"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={link.description}
                >
                  <link.icon size={20} />
                </motion.a>
              ))}
            </div>
            {lastUpdate && (
              <div className={`text-xs ${
                isLight ? "text-gray-500" : "text-blue-300"
              }`}>
                Last updated: {lastUpdate.toLocaleString()}
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className={`pt-6 border-t ${
            isLight ? "border-gray-200/50" : "border-blue-700/20"
          } flex flex-col md:flex-row justify-between items-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <div className={`text-sm mb-2 md:mb-0 ${
            isLight ? "text-gray-600" : "text-blue-200"
          }`}>
            © {currentYear} PakWeather. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center ${
              isLight ? "text-gray-600" : "text-blue-200"
            }`}>
              Made By Taha Usman
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart size={14} className="mx-1 text-red-500 fill-current" />
              </motion.span>
              for Pakistan
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield size={12} className={isLight ? "text-green-600" : "text-green-400"} />
              <span className={isLight ? "text-gray-500" : "text-blue-300"}>
                Secure & Reliable
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Element */}
      <motion.div
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 ${
          isLight 
            ? "bg-gradient-to-r from-transparent via-blue-400 to-transparent" 
            : "bg-gradient-to-r from-transparent via-blue-500 to-transparent"
        }`}
        initial={{ width: 0 }}
        animate={{ width: '8rem' }}
        transition={{ duration: 1, delay: 2 }}
      />
    </motion.footer>
  );
};

export default Footer;