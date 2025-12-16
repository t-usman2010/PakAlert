import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Brain, Loader, AlertCircle, Sparkles, TrendingUp,
  CloudRain, Sun, Wind, Droplets, ThermometerSun,
  Shield, Info, CheckCircle2, XCircle, RefreshCw
} from 'lucide-react';

const AIWeatherInsights = ({ theme, weatherData, city }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  useEffect(() => {
    if (weatherData && city && GEMINI_API_KEY) {
      generateInsights();
    }
  }, [weatherData, city]);

  const generateInsights = async () => {
    if (!GEMINI_API_KEY) {
      setError('Gemini API key not configured');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `
You are a weather analysis expert. Analyze the following weather data for ${city} and provide insights in JSON format.

Weather Data:
- Temperature: ${weatherData.main?.temp}°C
- Feels Like: ${weatherData.main?.feels_like}°C
- Humidity: ${weatherData.main?.humidity}%
- Pressure: ${weatherData.main?.pressure} hPa
- Wind Speed: ${weatherData.wind?.speed} m/s
- Weather: ${weatherData.weather?.[0]?.description}
- Visibility: ${weatherData.visibility} meters
- Cloud Coverage: ${weatherData.clouds?.all}%

Provide a JSON response with the following structure:
{
  "summary": "2-3 sentence weather summary",
  "healthImpact": {
    "level": "low/moderate/high",
    "description": "Health implications of current conditions"
  },
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ],
  "activities": {
    "recommended": ["activity1", "activity2"],
    "avoid": ["activity1", "activity2"]
  },
  "forecast_prediction": "What to expect in the next few hours",
  "clothing_suggestion": "What to wear based on temperature and weather"
}

Return ONLY valid JSON, no additional text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedInsights = JSON.parse(jsonMatch[0]);
        setInsights(parsedInsights);
        setLastUpdate(new Date());
      } else {
        throw new Error('Invalid response format from AI');
      }
    } catch (err) {
      console.error('Error generating AI insights:', err);
      setError('Failed to generate AI insights. Please try again.');
      // Fallback to basic insights
      setInsights(generateBasicInsights());
    } finally {
      setLoading(false);
    }
  };

  const generateBasicInsights = () => {
    const temp = weatherData.main?.temp || 0;
    const humidity = weatherData.main?.humidity || 0;
    const windSpeed = weatherData.wind?.speed || 0;

    let healthLevel = 'low';
    let summary = `Current temperature is ${temp}°C with ${humidity}% humidity.`;
    let recommendations = [];
    let activities = { recommended: [], avoid: [] };

    if (temp > 35) {
      healthLevel = 'high';
      summary += ' Very hot conditions. Heat stress risk is high.';
      recommendations = ['Stay hydrated', 'Avoid direct sunlight', 'Stay in air-conditioned spaces'];
      activities.avoid = ['Outdoor sports', 'Heavy exercise', 'Long walks'];
      activities.recommended = ['Indoor activities', 'Swimming', 'Evening walks'];
    } else if (temp > 25) {
      healthLevel = 'moderate';
      summary += ' Warm and comfortable weather.';
      recommendations = ['Drink plenty of water', 'Use sunscreen', 'Light clothing recommended'];
      activities.recommended = ['Outdoor activities', 'Sports', 'Picnics'];
      activities.avoid = ['Strenuous activities in peak hours'];
    } else if (temp > 15) {
      healthLevel = 'low';
      summary += ' Pleasant weather conditions.';
      recommendations = ['Enjoy outdoor activities', 'Perfect for exercise', 'Light jacket may be needed'];
      activities.recommended = ['Hiking', 'Cycling', 'Outdoor sports'];
      activities.avoid = [];
    } else {
      healthLevel = 'moderate';
      summary += ' Cool weather. Dress warmly.';
      recommendations = ['Wear warm clothing', 'Hot beverages recommended', 'Layer your clothes'];
      activities.recommended = ['Indoor activities', 'Hot drinks', 'Warm meals'];
      activities.avoid = ['Water activities', 'Light clothing'];
    }

    return {
      summary,
      healthImpact: {
        level: healthLevel,
        description: `Current conditions pose ${healthLevel} health risk.`
      },
      recommendations,
      activities,
      forecast_prediction: 'Weather conditions expected to remain stable.',
      clothing_suggestion: temp > 25 ? 'Light, breathable clothing' : temp > 15 ? 'Light jacket' : 'Warm layers'
    };
  };

  const getHealthColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'text-green-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'high':
        return 'text-red-500';
      default:
        return theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
    }
  };

  const getHealthIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'moderate':
        return <Info className="text-yellow-500" size={20} />;
      case 'high':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  if (loading) {
    return (
      <motion.div
        className={`rounded-2xl p-8 border shadow-lg ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700/50'
            : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Brain className="text-purple-500" size={48} />
          </motion.div>
          <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            AI is analyzing weather conditions...
          </p>
          <Loader className="text-purple-500 animate-spin" size={24} />
        </div>
      </motion.div>
    );
  }

  if (error && !insights) {
    return (
      <motion.div
        className={`rounded-2xl p-6 border shadow-lg ${
          theme === 'dark'
            ? 'bg-red-900/30 border-red-700/50'
            : 'bg-red-50 border-red-200'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-500" size={24} />
          <div className="flex-1">
            <p className={`font-medium ${theme === 'dark' ? 'text-red-100' : 'text-red-900'}`}>
              AI Insights Unavailable
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
          </div>
          <button
            onClick={generateInsights}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-red-700/30 hover:bg-red-700/50 text-red-100'
                : 'bg-red-100 hover:bg-red-200 text-red-800'
            }`}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </motion.div>
    );
  }

  if (!insights) return null;

  return (
    <motion.div
      className={`rounded-2xl p-6 border shadow-lg ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700/50'
          : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-purple-600/30' : 'bg-purple-100'
          }`}>
            <Brain className="text-purple-500" size={24} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              AI Weather Insights
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Powered by Google Gemini AI
            </p>
          </div>
        </div>
        <motion.button
          onClick={generateInsights}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'bg-purple-700/30 hover:bg-purple-700/50 text-purple-100'
              : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          <RefreshCw size={18} />
        </motion.button>
      </div>

      {/* Summary */}
      <div className={`mb-6 p-4 rounded-xl ${
        theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'
      }`}>
        <div className="flex items-start gap-3">
          <Sparkles className="text-purple-500 flex-shrink-0 mt-1" size={20} />
          <p className={`${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
            {insights.summary}
          </p>
        </div>
      </div>

      {/* Health Impact */}
      <div className={`mb-6 p-4 rounded-xl ${
        theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          {getHealthIcon(insights.healthImpact?.level)}
          <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Health Impact:{' '}
            <span className={getHealthColor(insights.healthImpact?.level)}>
              {insights.healthImpact?.level?.toUpperCase()}
            </span>
          </h4>
        </div>
        <p className={`ml-8 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          {insights.healthImpact?.description}
        </p>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          <Shield size={18} />
          Recommendations
        </h4>
        <div className="space-y-2">
          {insights.recommendations?.map((rec, index) => (
            <motion.div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
              <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {rec}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Recommended Activities */}
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'
        }`}>
          <h5 className={`font-semibold mb-3 flex items-center gap-2 ${
            theme === 'dark' ? 'text-green-100' : 'text-green-900'
          }`}>
            <CheckCircle2 className="text-green-500" size={18} />
            Recommended
          </h5>
          <div className="space-y-2">
            {insights.activities?.recommended?.map((activity, index) => (
              <div
                key={index}
                className={`text-sm flex items-center gap-2 ${
                  theme === 'dark' ? 'text-green-200' : 'text-green-800'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                {activity}
              </div>
            ))}
          </div>
        </div>

        {/* Activities to Avoid */}
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200'
        }`}>
          <h5 className={`font-semibold mb-3 flex items-center gap-2 ${
            theme === 'dark' ? 'text-red-100' : 'text-red-900'
          }`}>
            <XCircle className="text-red-500" size={18} />
            Better Avoid
          </h5>
          <div className="space-y-2">
            {insights.activities?.avoid?.length > 0 ? (
              insights.activities.avoid.map((activity, index) => (
                <div
                  key={index}
                  className={`text-sm flex items-center gap-2 ${
                    theme === 'dark' ? 'text-red-200' : 'text-red-800'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  {activity}
                </div>
              ))
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-red-200' : 'text-red-800'}`}>
                No restrictions
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-blue-500" size={18} />
            <h5 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Forecast Prediction
            </h5>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            {insights.forecast_prediction}
          </p>
        </div>

        <div className={`p-4 rounded-xl ${
          theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <ThermometerSun className="text-orange-500" size={18} />
            <h5 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Clothing Suggestion
            </h5>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            {insights.clothing_suggestion}
          </p>
        </div>
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div className={`mt-4 text-xs text-center ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </motion.div>
  );
};

export default AIWeatherInsights;
