import React from 'react';

const LoadingState = () => {
  return (
    <div className="space-y-4">
      <div className="text-center text-lg text-neutral-text-secondary mb-6 animate-pulse">
        Finding best rides...
      </div>

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-5 shadow-card border border-neutral-border animate-pulse"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-5 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
