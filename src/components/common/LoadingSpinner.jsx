// components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-cyan-200 rounded-full animate-spin border-t-cyan-500`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${sizeClasses[size]} border-4 border-transparent rounded-full animate-spin border-t-mint-500`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-600 animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center gradient-mesh z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
