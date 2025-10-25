import React, { useState } from 'react';
import axios from 'axios';
import { Send, MapPin, FileText, AlertCircle, CheckCircle2, Loader } from 'lucide-react';

const ReportForm = () => {
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setIsLoading(true);
    
    try {
      await axios.post('/api/reports', { city, description });
      // Report submitted but requires admin verification
      setStatus('pending');
      setCity('');
      setDescription('');
    } catch (err) {
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <Send className="text-blue-600" size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Submit Weather Report</h2>
        <p className="text-gray-600 mt-2">Help improve our weather data accuracy</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <MapPin size={16} className="mr-2" />
            City Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter city name..."
              required
              disabled={isLoading}
            />
            <MapPin size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <FileText size={16} className="mr-2" />
            Weather Description
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe current weather conditions, temperature, precipitation, etc."
              required
              disabled={isLoading}
            />
            <FileText size={18} className="absolute left-4 top-4 text-gray-400" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={20} className="mr-2" />
              Submit Report
            </>
          )}
        </button>
      </form>

      {status === 'pending' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start">
          <CheckCircle2 size={20} className="text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-800 font-medium">Report submitted — awaiting verification</p>
            <p className="text-yellow-700 text-sm mt-1">Your report has been queued for admin review. It will appear publicly once approved.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
          <AlertCircle size={20} className="text-red-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-medium">Error submitting report</p>
            <p className="text-red-700 text-sm mt-1">Please try again in a few moments.</p>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <AlertCircle size={16} className="mr-2 text-gray-400" />
          <span>Your reports help improve weather accuracy for everyone</span>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;