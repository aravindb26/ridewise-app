import React from 'react';

export function RideCard({ ride, isCheapest, isFastest }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{ride.icon}</span>
          <h3 className="font-semibold text-lg">{ride.name}</h3>
        </div>
        <div className="flex gap-1.5">
          {isCheapest && (
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700">Cheapest</span>
          )}
          {isFastest && (
            <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-bold text-blue-700">Fastest</span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold" style={{ color: ride.brandColor }}>₹{ride.priceMin}</span>
        <span className="text-base font-semibold text-slate-400">–</span>
        <span className="text-3xl font-extrabold" style={{ color: ride.brandColor }}>₹{ride.priceMax}</span>
      </div>

      {/* ETA */}
      <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
        <span>⏱ {ride.etaMin} – {ride.etaMax} min</span>
      </div>

      {/* Surge */}
      {ride.surge && (
        <div className="mt-1 text-xs font-bold text-orange-500">
          🔥 {ride.surge.reason} (+{Math.round((ride.surge.multiplier - 1) * 100)}%)
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => window.open(ride.webFallback || 'https://book.olacabs.com', '_blank')}
        className="mt-4 w-full rounded-2xl py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
        style={{ backgroundColor: ride.brandColor }}
      >
        Book {ride.name} →
      </button>
    </div>
  );
}
