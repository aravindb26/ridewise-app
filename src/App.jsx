import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PlacesInput from './components/PlacesInput';
import ProviderCard from './components/ProviderCard';
import RouteMap from './components/RouteMap';
import rideWiseAPI from './services/api';

export default function App() {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [estimates, setEstimates] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState('search'); // search | loading | results

  const handleCompare = useCallback(async () => {
    if (!pickup || !destination) return;
    setLoading(true);
    setPhase('loading');

    try {
      const res = await rideWiseAPI.getEstimates(pickup, destination);
      setEstimates(res.estimates);
      setRouteInfo(res.route);
      setPhase('results');
    } finally {
      setLoading(false);
    }
  }, [pickup, destination]);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />

      {/* ─── Search phase ─── */}
      {phase === 'search' && (
        <main className="flex-1 flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-md fade-in">
            <h1 className="text-4xl font-extrabold text-center mb-2">
              Compare rides <span className="text-primary">instantly</span>
            </h1>
            <p className="text-center text-text-secondary mb-8">
              See Uber, Ola & Rapido prices side by side before you book
            </p>

            <div className="glass-card p-6 space-y-4">
              <PlacesInput
                label="Pickup"
                placeholder="Start location… (home, landmark, address)"
                onSelect={setPickup}
              />
              <PlacesInput
                label="Destination"
                placeholder="Where are you heading?"
                onSelect={setDestination}
              />

              <button
                className="btn-primary mt-2"
                onClick={handleCompare}
                disabled={!pickup || !destination}
              >
                🔍 Compare Rides
              </button>

              {/* Quick presets */}
              <div className="text-center text-xs text-text-muted pt-2">
                Try: "Koramangala → MG Road" or your saved home/office address
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ─── Loading phase ─── */}
      {phase === 'loading' && (
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center fade-in">
            <div className="loading-dot mb-4"><span /><span /><span /></div>
            <p className="text-text-secondary">Finding the best rides for you…</p>
          </div>
        </main>
      )}

      {/* ─── Results phase ─── */}
      {phase === 'results' && estimates && (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: route info + provider cards */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{pickup.name} → {destination.name}</h2>
                <p className="text-sm text-text-secondary mt-1">
                  {routeInfo?.distance || '—'} km · ~{routeInfo?.duration || '—'} min
                </p>
              </div>
              <button onClick={() => setPhase('search')} className="text-sm text-primary font-medium">
                Edit route
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(estimates).map(([k, est]) => (
                <ProviderCard key={k} estimate={est} pickup={pickup} destination={destination} isWinner={!!est.badge} />
              ))}
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-text-muted text-center pt-4">
              Prices are smart estimates, not final. Always verify in the provider app before booking.
            </div>
          </div>

          {/* Right: map */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <RouteMap pickup={pickup} destination={destination} />
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-text-muted border-t border-border mt-auto">
        RideWise is independent and not affiliated with Uber, Ola, or Rapido.
      </footer>
    </div>
  );
}
