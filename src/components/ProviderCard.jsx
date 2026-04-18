import React from 'react';

export default function ProviderCard({ estimate, pickup, destination, isWinner }) {
  const { provider, priceMin, priceMax, etaMin, etaMax, badge, surge } = estimate;
  const name = provider?.name || estimate.label || 'Unknown';
  const logo = provider?.logo || estimate.icon || '🚗';
  const brandColor = provider?.brandColor || '#0F62FE';
  const deepLink = provider?.deepLinkBase;
  const webFallback = provider?.webFallback;

  const badgeLabel = { Cheapest: 'Cheapest', Fastest: 'Fastest' };
  const badgeCls = { Cheapest: 'badge badge-green', Fastest: 'badge badge-orange' }[badge] || '';

  const handleOpenApp = () => {
    if (!pickup || !destination) {
      window.open(webFallback || '/', '_blank');
      return;
    }
    const { lat: pl, lng: pLng } = pickup;
    const { lat: dl, lng: dLng } = destination;

    if (name.includes('Uber')) {
      window.open(`https://m.uber.com/looking/pickup?setLat=${dl}&setLng=${dLng}&pickup[latitude]=${pl}&pickup[longitude]=${pLng}&dropoff[latitude]=${dl}&dropoff[longitude]=${dLng}`, '_blank');
    } else if (name.includes('Ola')) {
      window.open(`https://book.olacabs.com/?lat=${pl}&lng=${pLng}&drop_lat=${dl}&drop_lng=${dLng}`, '_blank');
    } else if (name.includes('Rapido')) {
      window.open(`https://www.rapido.bike/ride?pickup_lat=${pl}&pickup_lng=${pLng}&drop_lat=${dl}&drop_lng=${dLng}`, '_blank');
    } else {
      window.open(deepLink || '/route?lat=${pl}&lng=${pLng}&dl=${dl}&dlng=${dLng}', '_blank');
    }
  };

  return (
    <div className={`provider-card relative ${isWinner ? 'ring-2 ring-primary ring-offset-2' : ''} fade-in`}>
      {/* Cheapest/Fastest badge */}
      {badge && (
        <div className="absolute -top-3 right-4">
          <span className={badgeCls}>{badgeLabel[badge] || badge}</span>
        </div>
      )}

      {/* Left: logo + name */}
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
           style={{ backgroundColor: brandColor + '15' }}>
        {logo}
      </div>

      {/* Middle: details */}
      <div className="flex-1 min-w-0">
        <div className="text-base font-bold">{name}</div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm font-semibold">₹{priceMin} – ₹{priceMax}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-sm text-text-secondary">{etaMin}–{etaMax} min</span>
        </div>
        {surge && (
          <div className="flex items-center gap-1 text-xs text-accent-orange font-semibold mt-1">
            🔥 Surge +{Math.round((surge.multiplier - 1) * 100)}%
          </div>
        )}
      </div>

      {/* Right: CTA */}
      <button onClick={handleOpenApp}
              className="flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition active:scale-95"
              style={{ backgroundColor: brandColor }}>
        Check Price →
      </button>
    </div>
  );
}
