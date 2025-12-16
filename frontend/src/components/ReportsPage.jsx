import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, 
  User, 
  MapPin, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Loader,
  MessageSquare,
  ThumbsUp,
  Eye,
  RefreshCw,
  Cloud,
  CloudRain,
  Sun,
  CloudSnow
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE || '';

const ReportsPage = ({ theme, reports: initialReports, onReportSubmit }) => {
  const [reports, setReports] = useState(initialReports || []);
  const [reporter, setReporter] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!initialReports || initialReports.length === 0) {
      fetchReports();
    }
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/reports`);
      setReports(res.data);
    } catch (err) {
      setStatus('error:Failed to load reports.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('reporter', reporter);
      formData.append('city', location);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }

      await axios.post(`${API_BASE}/reports`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Inform the user that report is submitted but needs admin verification
      setStatus('success:Report submitted — awaiting admin verification');
      setReporter('');
      setLocation('');
      setDescription('');
      setImage(null);
      fetchReports();
      if (onReportSubmit) {
        onReportSubmit();
      }
    } catch (err) {
      setStatus('error:Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('storm')) return CloudRain;
    if (desc.includes('snow') || desc.includes('cold')) return CloudSnow;
    if (desc.includes('sun') || desc.includes('clear') || desc.includes('warm')) return Sun;
    if (desc.includes('cloud')) return Cloud;
    return Cloud;
  };

  const [statusType, statusMessage] = status.split(':');
  const isLight = theme === "light";

  return (
    <div className={`min-h-screen py-8 transition-all duration-300 ${
      isLight ? "bg-gradient-to-br from-blue-50 to-indigo-50" : "bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 transition-all duration-300 ${
            isLight 
              ? "bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg shadow-blue-100/50" 
              : "bg-gradient-to-br from-blue-900/20 to-indigo-900/20 shadow-lg shadow-blue-900/10 backdrop-blur-xl"
          }`}>
            <MessageSquare className={
              isLight 
                ? "text-blue-600" 
                : "text-blue-400"
            } size={36} />
          </div>
          <h1 className={`text-4xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent ${
            isLight 
              ? "from-gray-800 to-blue-700" 
              : "from-white to-blue-300"
          }`}>
            Community Weather Reports
          </h1>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${
            isLight ? "text-gray-600" : "text-slate-400"
          }`}>
            Share and view real-time weather observations from your community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className={`rounded-3xl shadow-2xl border p-8 transition-all duration-300 ${
            isLight 
              ? "bg-white/95 border-gray-100/80 shadow-gray-200/50" 
              : "bg-slate-800/40 border-slate-600/30 shadow-slate-900/50 backdrop-blur-2xl"
          }`}>
            <h2 className={`text-2xl font-bold mb-8 flex items-center ${
              isLight ? "text-gray-800" : "text-white"
            }`}>
              <div className={`p-2 rounded-xl mr-3 ${
                isLight 
                  ? "bg-blue-100 text-blue-600" 
                  : "bg-blue-900/30 text-blue-400 backdrop-blur-lg"
              }`}>
                <Send size={20} />
              </div>
              Submit New Report
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className={`flex items-center text-sm font-semibold ${
                  isLight ? "text-gray-700" : "text-slate-300"
                }`}>
                  <User size={16} className="mr-2" />
                  Your Name
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={reporter} 
                    onChange={e => setReporter(e.target.value)} 
                    className={`w-full rounded-2xl px-5 py-4 pl-12 focus:outline-none focus:ring-3 transition-all duration-200 border-2 backdrop-blur-sm ${
                      isLight
                        ? "border-gray-200 bg-white/90 text-gray-800 placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-400"
                        : "border-slate-600/50 bg-slate-700/30 text-white placeholder-slate-400 focus:ring-blue-500/20 focus:border-blue-500/50 backdrop-blur-lg"
                    }`}
                    placeholder="Enter your name..."
                    required
                    disabled={isSubmitting}
                  />
                  <User size={20} className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                    isLight ? "text-gray-400" : "text-slate-400"
                  }`} />
                </div>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center text-sm font-semibold ${
                  isLight ? "text-gray-700" : "text-slate-300"
                }`}>
                  <MapPin size={16} className="mr-2" />
                  Location
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    className={`w-full rounded-2xl px-5 py-4 pl-12 focus:outline-none focus:ring-3 transition-all duration-200 border-2 backdrop-blur-sm ${
                      isLight
                        ? "border-gray-200 bg-white/90 text-gray-800 placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-400"
                        : "border-slate-600/50 bg-slate-700/30 text-white placeholder-slate-400 focus:ring-blue-500/20 focus:border-blue-500/50 backdrop-blur-lg"
                    }`}
                    placeholder="City, State or specific location..."
                    required
                    disabled={isSubmitting}
                  />
                  <MapPin size={20} className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                    isLight ? "text-gray-400" : "text-slate-400"
                  }`} />
                </div>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center text-sm font-semibold ${
                  isLight ? "text-gray-700" : "text-slate-300"
                }`}>
                  <FileText size={16} className="mr-2" />
                  Weather Description
                </label>
                <div className="relative">
                  <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    rows={4}
                    className={`w-full rounded-2xl px-5 py-4 pl-12 focus:outline-none focus:ring-3 transition-all duration-200 resize-none border-2 backdrop-blur-sm ${
                      isLight
                        ? "border-gray-200 bg-white/90 text-gray-800 placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-400"
                        : "border-slate-600/50 bg-slate-700/30 text-white placeholder-slate-400 focus:ring-blue-500/20 focus:border-blue-500/50 backdrop-blur-lg"
                    }`}
                    placeholder="Describe current weather conditions, temperature, precipitation, wind, etc."
                    required
                    disabled={isSubmitting}
                  />
                  <FileText size={20} className={`absolute left-4 top-4 transition-colors ${
                    isLight ? "text-gray-400" : "text-slate-400"
                  }`} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full text-white py-4 px-6 rounded-2xl font-semibold focus:outline-none focus:ring-3 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg ${
                  isLight
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500/40 focus:ring-offset-white shadow-blue-500/25"
                    : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:ring-blue-500/30 focus:ring-offset-slate-900 shadow-blue-900/30 backdrop-blur-lg"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin mr-3" />
                    Submitting Report...
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-3" />
                    Submit Weather Report
                  </>
                )}
              </button>
            </form>

            {status && (
              <div className={`mt-6 p-5 rounded-2xl border-2 flex items-start transition-all duration-300 ${
                statusType === 'success' 
                  ? isLight 
                    ? 'bg-blue-50 border-blue-200 shadow-lg shadow-blue-100/50' 
                    : 'bg-blue-900/20 border-blue-700/30 shadow-lg shadow-blue-900/10 backdrop-blur-xl'
                  : isLight 
                    ? 'bg-red-50 border-red-200 shadow-lg shadow-red-100/50' 
                    : 'bg-red-900/20 border-red-700/30 shadow-lg shadow-red-900/10 backdrop-blur-xl'
              }`}>
                {statusType === 'success' ? (
                  <CheckCircle2 size={24} className={`mr-4 mt-0.5 flex-shrink-0 ${
                    isLight ? "text-blue-600" : "text-blue-400"
                  }`} />
                ) : (
                  <AlertCircle size={24} className={`mr-4 mt-0.5 flex-shrink-0 ${
                    isLight ? "text-red-600" : "text-red-400"
                  }`} />
                )}
                <div>
                  <p className={`font-semibold ${
                    statusType === 'success' 
                      ? isLight ? 'text-blue-800' : 'text-blue-200'
                      : isLight ? 'text-red-800' : 'text-red-200'
                  }`}>
                    {statusMessage}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Reports List */}
          <div className={`rounded-3xl shadow-2xl border p-8 transition-all duration-300 ${
            isLight 
              ? "bg-white/95 border-gray-100/80 shadow-gray-200/50" 
              : "bg-slate-800/40 border-slate-600/30 shadow-slate-900/50 backdrop-blur-2xl"
          }`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-2xl font-bold flex items-center ${
                isLight ? "text-gray-800" : "text-white"
              }`}>
                <div className={`p-2 rounded-xl mr-3 ${
                  isLight 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-blue-900/30 text-blue-400 backdrop-blur-lg"
                }`}>
                  <MessageSquare size={20} />
                </div>
                Recent Reports
              </h2>
              <button 
                onClick={fetchReports}
                disabled={isLoading}
                className={`flex items-center text-sm font-medium transition-all duration-200 ${
                  isLight 
                    ? "text-gray-600 hover:text-blue-700 bg-gray-100 hover:bg-blue-100" 
                    : "text-slate-400 hover:text-blue-300 bg-slate-700/50 hover:bg-blue-900/30"
                } disabled:opacity-50 px-4 py-2 rounded-xl backdrop-blur-sm`}
              >
                <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader size={40} className="animate-spin text-blue-500 mb-4" />
                <p className={isLight ? "text-gray-600" : "text-slate-400"}>Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-16">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 ${
                  isLight 
                    ? "bg-gray-100" 
                    : "bg-slate-700/50 backdrop-blur-lg"
                }`}>
                  <Cloud className={isLight ? "text-gray-400" : "text-slate-500"} size={36} />
                </div>
                <p className={`font-semibold text-lg mb-2 ${
                  isLight ? "text-gray-700" : "text-slate-300"
                }`}>
                  No weather reports yet
                </p>
                <p className={`text-sm ${
                  isLight ? "text-gray-500" : "text-slate-500"
                }`}>
                  Be the first to share a weather observation in your area
                </p>
              </div>
            ) : (
              <div className="space-y-5 max-h-[500px] overflow-y-auto pr-3">
                {reports.map(r => {
                  const WeatherIcon = getWeatherIcon(r.description);
                  return (
                    <div key={r._id} className={`border-2 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 backdrop-blur-sm ${
                      isLight 
                        ? "border-gray-100 bg-white/70 hover:bg-white/90 hover:shadow-gray-200/50" 
                        : "border-slate-600/30 bg-slate-700/20 hover:bg-slate-700/30 hover:shadow-slate-900/30 backdrop-blur-lg"
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-xl mr-4 ${
                            isLight 
                              ? "bg-gradient-to-br from-blue-100 to-indigo-100" 
                              : "bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-lg"
                          }`}>
                            <WeatherIcon className={
                              isLight ? "text-blue-600" : "text-blue-400"
                            } size={20} />
                          </div>
                          <div>
                            <p className={`font-bold text-lg ${
                              isLight ? "text-gray-900" : "text-white"
                            }`}>
                              {r.reporter}
                            </p>
                            <div className={`flex items-center text-sm mt-1 ${
                              isLight ? "text-gray-600" : "text-slate-400"
                            }`}>
                              <MapPin size={14} className="mr-2" />
                              <span>{r.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`flex items-center text-xs font-medium px-3 py-1 rounded-full ${
                          isLight 
                            ? "text-gray-500 bg-gray-100" 
                            : "text-slate-400 bg-slate-600/30 backdrop-blur-sm"
                        }`}>
                          <Clock size={12} className="mr-2" />
                          <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <p className={`rounded-xl p-4 text-sm leading-relaxed ${
                        isLight 
                          ? "text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100/80" 
                          : "text-slate-300 bg-gradient-to-br from-slate-600/10 to-slate-700/10 backdrop-blur-lg"
                      }`}>
                        {r.description}
                      </p>
                      
                      <div className={`flex items-center justify-between mt-4 pt-4 border-t ${
                        isLight ? "border-gray-100" : "border-slate-600/30"
                      }`}>
                        <div className={`flex items-center text-xs ${
                          isLight ? "text-gray-500" : "text-slate-400"
                        }`}>
                          <span className="flex items-center mr-4 cursor-pointer transition-all duration-200 hover:scale-110">
                            <ThumbsUp size={14} className="mr-2" />
                            0
                          </span>
                          <span className="flex items-center cursor-pointer transition-all duration-200 hover:scale-110">
                            <Eye size={14} className="mr-2" />
                            0
                          </span>
                        </div>
                        <span className={`text-xs font-medium ${
                          isLight ? "text-gray-400" : "text-slate-500"
                        }`}>
                          {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;