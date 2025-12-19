// components/common/ConnectionStatus.jsx
import React from 'react';

const ConnectionStatus = ({ isOnline, serverStatus }) => {
  if (isOnline && serverStatus === 'online') return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
      {!isOnline && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 text-center text-sm font-semibold">
          <span className="inline-flex items-center gap-2">
            <span className="status-offline"></span>
            No Internet Connection - Please check your network
          </span>
        </div>
      )}
      
      {isOnline && serverStatus === 'offline' && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 text-center text-sm font-semibold">
          <span className="inline-flex items-center gap-2">
            <span className="status-offline"></span>
            Server Offline - Unable to reach backend services
          </span>
        </div>
      )}
      
      
      {isOnline && serverStatus === 'checking' && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 text-center text-sm font-semibold">
          <span className="inline-flex items-center gap-2">
            <span className="animate-spin">🔄</span>
            Checking server status...
          </span>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
