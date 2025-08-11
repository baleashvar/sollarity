import React from 'react';

const LiveIndicator = ({ isLive = false, size = 'sm' }) => {
  if (!isLive) return null;

  const sizeClasses = {
    xs: 'w-1 h-1',
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="flex items-center space-x-1">
      <div className={`${sizeClasses[size]} bg-red-500 rounded-full animate-pulse`}></div>
      <span className="text-xs text-red-500 font-medium">LIVE</span>
    </div>
  );
};

export default LiveIndicator;