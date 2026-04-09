import React from 'react';

const EmptyState = ({ onTryAgain }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-card text-center max-w-md mx-auto">
      <div className="text-6xl mb-4">🛺</div>
      <h3 className="text-xl font-bold text-neutral-text-primary mb-2">
        Hmm, we couldn't find rides for this route.
      </h3>
      <div className="text-sm text-neutral-text-secondary mb-6 text-left space-y-2">
        <p className="font-semibold">Try:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>A nearby pickup location</li>
          <li>Double-check your destination</li>
          <li>Some areas may have limited service</li>
        </ul>
      </div>
      <button
        onClick={onTryAgain}
        className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};

export default EmptyState;
