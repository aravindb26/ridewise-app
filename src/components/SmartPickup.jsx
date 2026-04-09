import React from 'react';

const SmartPickup = ({ suggestion, onUse }) => {
  if (!suggestion) return null;

  return (
    <div className="bg-white rounded-xl p-5 shadow-card border border-primary/30">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xl">💡</span>
        <h3 className="text-lg font-bold text-neutral-text-primary">
          Smart Pickup Suggestion
        </h3>
      </div>

      <div className="mb-3">
        <div className="text-base font-semibold text-neutral-text-primary mb-2">
          Walk {suggestion.walkingTime} min to {suggestion.name}
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-accent-green">
            <span>⚡</span>
            <span className="font-medium">Save ₹{suggestion.priceSavings}</span>
          </div>
          <div className="flex items-center space-x-1 text-accent-green">
            <span>⏱</span>
            <span className="font-medium">Arrive {suggestion.timeSavings} min faster</span>
          </div>
        </div>
        <div className="text-xs text-neutral-text-muted mt-2">
          {suggestion.reason}
        </div>
      </div>

      <button
        onClick={onUse}
        className="w-full py-2.5 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all"
      >
        Use this pickup instead
      </button>
    </div>
  );
};

export default SmartPickup;
