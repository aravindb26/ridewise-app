import React from 'react';

export default function ProviderCard({ estimate, pickup, destination, isWinner }) {
  const { provider, priceMin, priceMax, etaMin, etaMax, badge, surge } = estimate;
  const name = provider?.name || estimate.label || 'Unknown';
  const logo = provider?.logo || estimate.icon || '🚗';
  const brandColor = provider?.brandColor || '#0F62FE';
  const webFallback = provider?.webFallback;

  const badgeCls = {
    Cheapest: 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-accent-green/10 text-accent-green',
    Fastest: 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-accent-orange/10 text-accent-orange',
  }[badge] || '';

  const handleOpenApp = () => {
    if (!pickup || !destination) { window.open(webFallback || '/', '_blank'); return; }
    const { lat: pl, lng: pLng } = pickup;
    const { lat: dl, lng: dLng } = destination;
    const urls = {};
    if (name.includes('Uber')) urls.href = `https://m.uber.com/looking/pickup?pickup[latitude]=${pl}&pickup[longitude]=${pLng}&dropoff[latitude]=${dl}&dropoff[longitude]=${dLng}`;
    else if (name.includes('Ola')) urls.href = `https://book.olacabs.com/?lat=${pl}&lng=${pLng}&drop_lat=${dl}&drop_lng=${dLng}`;
    else if (name.includes('Rapido')) urls.href = `https://www.rapido.bike/ride?pickup_lat=${pl}&pickup_lng=${pLng}&drop_lat=${dl}&drop_lng=${dLng}`;
    else urls.href = webFallback;
    window.open(urls.href || webFallback, '_blank');
  };

  return (
    <div
      className={`relative rounded-2xl border-2 bg-white p-5 transition-all cursor-pointer hover:shadow-md ${isWinner ? 'border-primary shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
      onClick={handleOpenApp}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-2.5 right-5">
          <span className={badgeCls}>{badge}</span>
        </div>
      )}

      {/* Row 1: Icon + Name */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: brandColor + '15' }}>
          {logo}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-text">{name}</h3>
        </div>
      </div>

      {/* Row 2: Price */}
      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-text">₹{priceMin}</span>
          <span className="text-base font-semibold text-gray-400">–</span>
          <span className="text-2xl font-extrabold text-text">₹{priceMax}</span>
        </div>
      </div>

      {/* Row 3: ETA + Surge */}
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>⏱</span>
          <span>{etaMin} – {etaMax} min</span>
        </div>
        {surge && (
          <div className="flex items-center gap-1 text-xs font-bold text-accent-orange">
            <span>🔥</span>
            <span>Surge +{Math.round((surge.multiplier - 1) * 100)}%</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-4">
        <button
          onClick={handleOpenApp}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition active:scale-95"
          style={{ backgroundColor: brandColor }}
        >
          {name} →
        </button>
      </div>
    </div>
  );
}
