import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-soft p-6 overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" 
         style={{ backgroundSize: '1000px 100%' }} />
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gradient-to-r from-primary-100 to-accent-light/50 rounded-lg w-2/3" />
        <div className="h-8 w-24 bg-gradient-to-r from-primary-100 to-accent-light/50 rounded-lg" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gradient-to-r from-primary-50 to-accent-mint/30 rounded w-full" />
        <div className="h-4 bg-gradient-to-r from-primary-50 to-accent-mint/30 rounded w-4/5" />
        <div className="h-4 bg-gradient-to-r from-primary-50 to-accent-mint/30 rounded w-3/5" />
      </div>
    </div>
  </div>
);

export const ListSkeleton = ({ count = 3 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl shadow-soft p-5 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" 
             style={{ backgroundSize: '1000px 100%', animationDelay: `${i * 0.1}s` }} />
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-light/50 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gradient-to-r from-primary-100 to-accent-light/50 rounded-lg w-1/2" />
            <div className="h-4 bg-gradient-to-r from-primary-50 to-accent-mint/30 rounded w-3/4" />
          </div>
          <div className="h-8 w-20 bg-gradient-to-r from-primary-100 to-accent-light/50 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
    <div className="h-14 bg-gradient-to-r from-primary-50 to-accent-mint/20 border-b border-primary-100/50" />
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="h-16 border-b border-primary-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" 
             style={{ backgroundSize: '1000px 100%', animationDelay: `${i * 0.1}s` }} />
        <div className="flex items-center p-4 space-x-4">
          <div className="h-4 bg-gradient-to-r from-primary-100 to-accent-light/50 rounded flex-1" />
          <div className="h-4 bg-gradient-to-r from-primary-50 to-accent-mint/30 rounded flex-1" />
          <div className="h-4 bg-gradient-to-r from-primary-100 to-accent-light/50 rounded w-24" />
        </div>
      </div>
    ))}
  </div>
);

export const AvatarSkeleton = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary-100 to-accent-light/50 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" 
           style={{ backgroundSize: '200px 100%' }} />
    </div>
  );
};
