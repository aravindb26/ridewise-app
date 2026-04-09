import React from 'react';

const ProviderCard = ({ estimate, isWinner }) => {
  const { provider, priceMin, priceMax, etaMin, etaMax, badge, isEstimated, isSurge, surgeMultiplier } = estimate;

  const handleBooking = () => {
    // Simulate deep link
    alert(`Opening ${provider.name} app...\n\nDeep link: ${provider.deepLinkBase}\nFallback: ${provider.webFallback}`);
    // In production: window.location.href = provider.deepLinkBase or provider.webFallback
  };

  const badgeColors = {
    Cheapest: 'bg-accent-green text-white',
    Fastest: 'bg-accent-orange text-white',
    'Most bikes': 'bg-accent-blue text-white',
  };

  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all ${
        isWinner ? 'border-2 border-primary' : 'border border-neutral-border'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{provider.logo}</span>
          <h3 className="text-lg font-bold text-neutral-text-primary">
            {provider.name}
          </h3>
        </div>
        {badge && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              badgeColors[badge] || 'bg-gray-200 text-gray-800'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="text-3xl font-bold text-neutral-text-primary">
          ₹{priceMin} - ₹{priceMax}
        </div>
        <div className="text-base text-neutral-text-secondary mt-1">
          ETA: {etaMin}-{etaMax} min
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        {isEstimated && (
          <span className="px-2 py-1 rounded bg-status-estimated text-neutral-text-secondary text-xs font-medium flex items-center">
            <span className="mr-1">~</span> Estimated
          </span>
        )}
        {isSurge && (
          <span className="px-2 py-1 rounded bg-status-warning/20 text-status-warning text-xs font-medium flex items-center">
            <span className="mr-1">🔥</span> Surge +{Math.round((surgeMultiplier - 1) * 100)}%
          </span>
        )}
      </div>

      <button
        onClick={handleBooking}
        style={{ backgroundColor: provider.brandColor }}
        className="w-full py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
      >
        <span>Book on {provider.name}</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default ProviderCard;
