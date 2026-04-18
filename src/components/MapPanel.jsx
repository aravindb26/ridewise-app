import React from 'react';

export function MapPanel({ pickup, destination }) {
  const hasRoute = pickup?.lat && destination?.lat;

  if (!hasRoute) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 min-h-64 flex items-center justify-center">
        Map will appear here
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${pickup.lat},${pickup.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <a href={mapUrl} target="_blank" rel="noreferrer"
         className="flex items-center justify-center gap-2 p-24 bg-gradient-to-br from-slate-100 to-slate-200 hover:from-blue-50 hover:to-blue-100 transition-colors cursor-pointer group">
        <div className="text-center">
          <div className="text-5xl mb-3">🗺️</div>
          <p className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">
            Open full route on Google Maps →
          </p>
        </div>
      </a>
    </div>
  );
}
