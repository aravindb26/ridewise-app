import React from 'react';

const ProviderCard = ({ estimate, isWinner }) => {
  const name = estimate.provider?.name || estimate.label || 'Unknown';
  const logo = estimate.provider?.logo || estimate.icon || '🚗';
  const brandColor = estimate.provider?.brandColor || '#0F83C0';

  const priceMin = estimate.priceMin;
  const priceMax = estimate.priceMax;
  const etaMin = estimate.etaMin;
  const etaMax = estimate.etaMax;
  const badge = estimate.badge;
  const surge = estimate.surge;

  const badgeColors = {
    Cheapest: 'bg-accent-green text-white',
    Fastest: 'bg-accent-orange text-white',
  };

  const handleOpenApp = () => {
    const key = name.toLowerCase().replace(/\s/g, '');
    const urls = {
      'ubergo': 'https://m.uber.com',
      'olamini': 'https://book.olacabs.com',
      'auto': 'https://m.uber.com',
      'rapidobike': 'https://www.rapido.bike',
    };
    const url = urls[key] || '/';
    window.open(url, '_blank');
  };

  return (
    <div className={`bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all ${isWinner ? 'border-2 border-primary' : 'border border-neutral-border'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{logo}</span>
          <h3 className="text-lg font-bold text-neutral-text-primary">{name}</h3>
        </div>
        {badge && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColors[badge] || 'bg-gray-200 text-gray-800'}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="text-3xl font-bold text-neutral-text-primary">₹{priceMin} - ₹{priceMax}</div>
        <div className="text-base text-neutral-text-secondary mt-1">ETA: {etaMin}-{etaMax} min</div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <span className="px-2 py-1 rounded bg-status-estimated text-neutral-text-secondary text-xs font-medium">~ Estimated</span>
        {surge && (
          <span className="px-2 py-1 rounded bg-status-warning/20 text-status-warning text-xs font-medium">🔥 Surge +{Math.round((surge.multiplier - 1) * 100)}%</span>
        )}
      </div>

      <button
        onClick={handleOpenApp}
        style={{ backgroundColor: brandColor }}
        className="w-full py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
      >
        <span>Check {name}</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default ProviderCard;
