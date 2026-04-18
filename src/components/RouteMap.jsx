import React from 'react';

export default function RouteMap({ pickup, destination, distance, duration }) {
  if (!pickup || !destination) return null;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${pickup.lat},${pickup.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-border overflow-hidden">
      <div className="p-6 text-center">
        <div className="text-5xl mb-3">🗺️</div>
        <p className="text-sm font-semibold text-gray-700 mb-1">
          {pickup.name} → {destination.name}
        </p>
        {distance && duration && (
          <p className="text-xs text-gray-400 mb-1">
            {distance} km · ~{duration} min
          </p>
        )}
        <p className="text-xs text-gray-400 mb-4">Tap for live route with traffic</p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
        >
          <span>Open in Google Maps</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
