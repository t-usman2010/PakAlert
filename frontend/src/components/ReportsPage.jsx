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
  RefreshCw
} from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE || '';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [reporter, setReporter] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReports();
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
      await axios.post(`${API_BASE}/reports`, { reporter, location, description });
      setStatus('success:Report submitted successfully!');
      setReporter('');
      setLocation('');
      setDescription('');
      fetchReports();
    } catch (err) {
      setStatus('error:Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [statusType, statusMessage] = status.split(':');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <MessageSquare className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Community Weather Reports</h1>
          <p className="text-gray-600 mt-2">Share and view real-time weather observations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Send className="text-blue-500 mr-2" size={20} />
              Submit New Report
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User size={16} className="mr-2" />
                  Your Name
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={reporter} 
                    onChange={e => setReporter(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your name..."
                    required
                    disabled={isSubmitting}
                  />
                  <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin size={16} className="mr-2" />
                  Location
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="City, State or specific location..."
                    required
                    disabled={isSubmitting}
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
                    placeholder="Describe current weather conditions, temperature, precipitation, wind, etc."
                    required
                    disabled={isSubmitting}
                  />
                  <FileText size={18} className="absolute left-4 top-4 text-gray-400" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
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

            {status && (
              <div className={`mt-6 p-4 rounded-xl flex items-start ${
                statusType === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {statusType === 'success' ? (
                  <CheckCircle2 size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={20} className="text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className={`font-medium ${
                    statusType === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {statusMessage}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Reports List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <MessageSquare className="text-blue-500 mr-2" size={20} />
                Recent Reports
              </h2>
              <button 
                onClick={fetchReports}
                disabled={isLoading}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
              >
                <RefreshCw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader size={32} className="animate-spin text-blue-500" />
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500 font-medium">No reports yet</p>
                <p className="text-gray-400 text-sm mt-1">Be the first to share a weather observation</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {reports.map(r => (
                  <div key={r._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <User className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{r.reporter}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin size={12} className="mr-1" />
                            <span>{r.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock size={12} className="mr-1" />
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">{r.description}</p>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center text-gray-500 text-xs">
                        <span className="flex items-center mr-3 cursor-pointer hover:text-blue-600 transition-colors">
                          <ThumbsUp size={12} className="mr-1" />
                          0
                        </span>
                        <span className="flex items-center cursor-pointer hover:text-blue-600 transition-colors">
                          <Eye size={12} className="mr-1" />
                          0
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;