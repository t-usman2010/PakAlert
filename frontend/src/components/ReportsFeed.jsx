import React from "react";
import { FileText, User, Clock, MapPin, MessageSquare, ThumbsUp, Eye } from "lucide-react";

export default function ReportsFeed({ reports }) {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="bg-indigo-100 p-2 rounded-xl mr-3">
          <FileText className="text-indigo-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">User Weather Reports</h2>
          <p className="text-sm text-gray-500">Real-time community observations</p>
        </div>
        <div className="ml-auto bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
          {reports.length} {reports.length === 1 ? 'report' : 'reports'}
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-10">
          <MessageSquare className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500 font-medium">No reports yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to share a weather observation</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <User className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.user}</p>
                    {report.city && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin size={12} className="mr-1" />
                        <span>{report.city}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">{report.text}</p>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center text-gray-500 text-xs">
                  <span className="flex items-center mr-3">
                    <ThumbsUp size={12} className="mr-1" />
                    0
                  </span>
                  <span className="flex items-center">
                    <Eye size={12} className="mr-1" />
                    0
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}