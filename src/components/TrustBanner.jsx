import React, { useState } from 'react';

const TrustBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-status-warning p-4 rounded-lg flex items-start space-x-3 mb-6">
      <span className="text-status-warning text-xl">ⓘ</span>
      <div className="flex-1">
        <p className="text-sm text-neutral-text-primary">
          These are estimated prices based on typical routes. Actual prices may vary.{' '}
          <a href="#" className="font-semibold text-status-warning hover:underline">
            Learn more →
          </a>
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-neutral-text-muted hover:text-neutral-text-primary text-xl leading-none"
      >
        ×
      </button>
    </div>
  );
};

export default TrustBanner;
