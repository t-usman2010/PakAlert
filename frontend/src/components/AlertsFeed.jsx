import { AlertTriangle, Clock, AlertCircle, Info, Shield, Bell, MapPin, AlertOctagon } from 'lucide-react';

export default function AlertsFeed({ alerts, theme }) {
  // Enhanced severity styling with theme support
  const getSeverityStyles = (severity) => {
    const isLight = theme === "light";
    
    switch (severity.toLowerCase()) {
      case 'extreme':
        return { 
          bg: isLight ? 'bg-red-50' : 'bg-red-900/20',
          border: isLight ? 'border-red-200' : 'border-red-700/30',
          icon: <AlertOctagon className={isLight ? "text-red-600" : "text-red-400"} size={20} />,
          text: isLight ? 'text-red-700' : 'text-red-300',
          badge: isLight ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-red-800/40 text-red-200 border border-red-700/50',
          badgeBg: isLight ? 'bg-white/50' : 'bg-slate-800/50'
        };
      case 'severe':
        return { 
          bg: isLight ? 'bg-orange-50' : 'bg-orange-900/20',
          border: isLight ? 'border-orange-200' : 'border-orange-700/30',
          icon: <AlertTriangle className={isLight ? "text-orange-600" : "text-orange-400"} size={20} />,
          text: isLight ? 'text-orange-700' : 'text-orange-300',
          badge: isLight ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-orange-800/40 text-orange-200 border border-orange-700/50',
          badgeBg: isLight ? 'bg-white/50' : 'bg-slate-800/50'
        };
      case 'moderate':
        return { 
          bg: isLight ? 'bg-yellow-50' : 'bg-yellow-900/20',
          border: isLight ? 'border-yellow-200' : 'border-yellow-700/30',
          icon: <AlertCircle className={isLight ? "text-yellow-600" : "text-yellow-400"} size={20} />,
          text: isLight ? 'text-yellow-700' : 'text-yellow-300',
          badge: isLight ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-yellow-800/40 text-yellow-200 border border-yellow-700/50',
          badgeBg: isLight ? 'bg-white/50' : 'bg-slate-800/50'
        };
      case 'minor':
        return { 
          bg: isLight ? 'bg-blue-50' : 'bg-blue-900/20',
          border: isLight ? 'border-blue-200' : 'border-blue-700/30',
          icon: <Info className={isLight ? "text-blue-600" : "text-blue-400"} size={20} />,
          text: isLight ? 'text-blue-700' : 'text-blue-300',
          badge: isLight ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-blue-800/40 text-blue-200 border border-blue-700/50',
          badgeBg: isLight ? 'bg-white/50' : 'bg-slate-800/50'
        };
      default:
        return { 
          bg: isLight ? 'bg-gray-50' : 'bg-gray-800/20',
          border: isLight ? 'border-gray-200' : 'border-gray-700/30',
          icon: <Info className={isLight ? "text-gray-600" : "text-gray-400"} size={20} />,
          text: isLight ? 'text-gray-700' : 'text-gray-300',
          badge: isLight ? 'bg-gray-100 text-gray-800 border border-gray-200' : 'bg-gray-800/40 text-gray-200 border border-gray-700/50',
          badgeBg: isLight ? 'bg-white/50' : 'bg-slate-800/50'
        };
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        return 'Just now';
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      }
    } catch {
      return "";
    }
  };

  const isLight = theme === "light";

  return (
    <div className={`rounded-xl shadow-lg border backdrop-blur-sm p-6 ${
      isLight 
        ? "bg-white/95 border-gray-200" 
        : "bg-slate-800/60 border-slate-600/50"
    }`}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className={`p-3 rounded-xl mr-3 ${
          isLight ? "bg-red-100" : "bg-red-900/30"
        }`}>
          <Bell className={isLight ? "text-red-600" : "text-red-400"} size={24} />
        </div>
        <div className="flex-1">
          <h2 className={`text-2xl font-bold ${
            isLight ? "text-gray-800" : "text-white"
          }`}>
            Weather Alerts
          </h2>
          <p className={`text-sm ${
            isLight ? "text-gray-600" : "text-slate-300"
          }`}>
            Active warnings and advisories
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isLight 
            ? "bg-gray-100 text-gray-600" 
            : "bg-slate-700/50 text-slate-300"
        }`}>
          {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center py-10">
          <Shield className={`mx-auto mb-3 ${
            isLight ? "text-green-300" : "text-green-500/50"
          }`} size={48} />
          <p className={`font-medium ${
            isLight ? "text-gray-500" : "text-slate-400"
          }`}>
            No active weather alerts
          </p>
          <p className={`text-sm mt-1 ${
            isLight ? "text-gray-400" : "text-slate-500"
          }`}>
            All clear! No warnings in your area.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const severityStyles = getSeverityStyles(alert.severity);
            const formattedDate = formatDate(alert.createdAt);
            const fullDate = new Date(alert.createdAt).toLocaleString();
            
            return (
              <div 
                key={alert._id} 
                className={`${severityStyles.bg} ${severityStyles.border} rounded-xl border p-4 transition-all hover:shadow-md backdrop-blur-sm`}
              >
                {/* Alert Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${severityStyles.badgeBg}`}>
                      {severityStyles.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${severityStyles.text}`}>
                        {alert.title}
                      </h3>
                      {alert.area && (
                        <div className={`flex items-center text-sm mt-1 ${
                          isLight ? "text-gray-600" : "text-slate-400"
                        }`}>
                          <MapPin size={12} className="mr-1" />
                          <span>{alert.area}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${severityStyles.badge}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                
                {/* Alert Description */}
                <p className={isLight ? "text-gray-700" : "text-slate-300"}>
                  {alert.description}
                </p>
                
                {/* Recommended Actions */}
                {alert.actions && alert.actions.length > 0 && (
                  <div className="mt-4">
                    <div className={`text-sm font-semibold mb-2 ${
                      isLight ? "text-gray-700" : "text-slate-300"
                    }`}>
                      🛡️ Recommended Actions:
                    </div>
                    <ul className="space-y-2">
                      {alert.actions.map((action, i) => (
                        <li key={i} className="flex items-start">
                          <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                            isLight ? "bg-gray-400" : "bg-slate-500"
                          }`}></div>
                          <span className={`text-sm ${
                            isLight ? "text-gray-700" : "text-slate-300"
                          }`}>
                            {action}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Date at the bottom */}
                {formattedDate && (
                  <div className={`flex items-center justify-between mt-4 pt-3 border-t ${
                    isLight ? "border-gray-200" : "border-slate-600/50"
                  }`}>
                    <div className={`flex items-center text-sm ${
                      isLight ? "text-gray-500" : "text-slate-400"
                    }`}>
                      <Clock size={14} className="mr-2" />
                      <span>{formattedDate}</span>
                    </div>
                    <span className={`text-xs ${
                      isLight ? "text-gray-400" : "text-slate-500"
                    }`}>
                      {fullDate}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}