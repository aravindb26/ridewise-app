import React from 'react';

const ProviderCard = ({ estimate, isWinner }) => {
  const { label, icon, priceMin, priceMax, etaMin, etaMax, badge, surge } = estimate;

  const badgeColors = {
    Cheapest: 'bg-accent-green text-white',
    Fastest: 'bg-accent-orange text-white',
  };

  const brandColors = {
    'Uber Go': '#000000',
    'Ola Mini': '#06B05F',
    Auto: '#FF6B00',
    'Rapido Bike': '#FFD700',
  };

  const handleOpenApp = () => {
    // Opens provider app with route (deep link would go here)
    const name = label.split(' ')[0].toLowerCase();
    const urls = {
      uber: 'https://m.uber.com',
      ola: 'https://book.olacabs.com',
      auto: 'https://m.uber.com',
      rapido: 'https://www.rapido.bike',
    };
    const url = urls[name] || '/';
    window.open(url, '_blank');
  };

  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all ${
        isWinner ? 'border-2 border-primary' : 'border border-neutral-border'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-lg font-bold text-neutral-text-primary">
            {label}
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
        <span className="px-2 py-1 rounded bg-status-estimated text-neutral-text-secondary text-xs font-medium flex items-center">
          <span className="mr-1">~</span> Estimated
        </span>
        {surge && (
          <span className="px-2 py-1 rounded bg-status-warning/20 text-status-warning text-xs font-medium flex items-center">
            <span className="mr-1">🔥</span> Surge +{Math.round((surge.multiplier - 1) * 100)}%
          </span>
        )}
      </div>

      <button
        onClick={handleOpenApp}
        style={{ backgroundColor: brandColors[label] || '#0F83C0' }}
        className="w-full py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
      >
        <span>Check {label}</span>
        <span>→</span>
      </button>
    </div>
  );
};

export default ProviderCard;
