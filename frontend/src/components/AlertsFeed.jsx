import { AlertTriangle, Clock, AlertCircle, Info, Shield, Bell, MapPin, AlertOctagon } from 'lucide-react';

export default function AlertsFeed({ alerts }) {
  // Enhanced severity styling with white theme
  const getSeverityStyles = (severity) => {
    switch (severity.toLowerCase()) {
      case 'extreme':
        return { 
          bg: 'bg-red-50', 
          border: 'border-red-200',
          icon: <AlertOctagon className="text-red-600" size={20} />,
          text: 'text-red-700',
          badge: 'bg-red-100 text-red-800 border border-red-200'
        };
      case 'severe':
        return { 
          bg: 'bg-orange-50', 
          border: 'border-orange-200',
          icon: <AlertTriangle className="text-orange-600" size={20} />,
          text: 'text-orange-700',
          badge: 'bg-orange-100 text-orange-800 border border-orange-200'
        };
      case 'moderate':
        return { 
          bg: 'bg-yellow-50', 
          border: 'border-yellow-200',
          icon: <AlertCircle className="text-yellow-600" size={20} />,
          text: 'text-yellow-700',
          badge: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
        };
      case 'minor':
        return { 
          bg: 'bg-blue-50', 
          border: 'border-blue-200',
          icon: <Info className="text-blue-600" size={20} />,
          text: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-800 border border-blue-200'
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          border: 'border-gray-200',
          icon: <Info className="text-gray-600" size={20} />,
          text: 'text-gray-700',
          badge: 'bg-gray-100 text-gray-800 border border-gray-200'
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

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="bg-red-100 p-3 rounded-xl mr-3">
          <Bell className="text-red-600" size={24} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Weather Alerts</h2>
          <p className="text-gray-600 text-sm">Active warnings and advisories</p>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
          {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center py-10">
          <Shield className="mx-auto text-green-300 mb-3" size={48} />
          <p className="text-gray-500 font-medium">No active weather alerts</p>
          <p className="text-gray-400 text-sm mt-1">All clear! No warnings in your area.</p>
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
                className={`${severityStyles.bg} ${severityStyles.border} rounded-xl border p-4 transition-all hover:shadow-md`}
              >
                {/* Alert Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-white/50">
                      {severityStyles.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${severityStyles.text}`}>
                        {alert.title}
                      </h3>
                      {alert.area && (
                        <div className="flex items-center text-sm mt-1 text-gray-600">
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
                <p className="text-gray-700 mt-2">
                  {alert.description}
                </p>
                
                {/* Recommended Actions - Before date */}
                {alert.actions && alert.actions.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      🛡️ Recommended Actions:
                    </div>
                    <ul className="space-y-2">
                      {alert.actions.map((action, i) => (
                        <li key={i} className="flex items-start">
                          <div className="w-2 h-2 rounded-full mt-2 mr-3 bg-gray-400"></div>
                          <span className="text-sm text-gray-700">
                            {action}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Date at the bottom */}
                {formattedDate && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-2" />
                      <span>{formattedDate}</span>
                    </div>
                    <span className="text-xs text-gray-400">
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