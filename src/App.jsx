// src/App.jsx
import { useMemo, useState } from 'react';
import { compareRides } from './api/ridewise.js';
import { geocodeAddress } from './api/places.js';
import { LocationInputs } from './components/LocationInputs.jsx';
import { RideCard } from './components/RideCard.jsx';
import { PickupSuggestions } from './components/PickupSuggestions.jsx';
import { MapPanel } from './components/MapPanel.jsx';
import { NoticeBanner } from './components/NoticeBanner.jsx';

const emptyLocation = { address: '', lat: null, lng: null };

export default function App() {
  const [pickup, setPickup] = useState(emptyLocation);
  const [destination, setDestination] = useState(emptyLocation);
  const [results, setResults] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activePickup = selectedSuggestion
    ? { ...pickup, ...selectedSuggestion, address: selectedSuggestion.address }
    : pickup;

  const providerNotices = useMemo(() => {
    if (!results?.providerNotices?.length) return [];
    return results.providerNotices.flatMap((notice) =>
      notice.notices.map((item) => `${notice.providerName}: ${item}`)
    );
  }, [results]);

  const warningMessages = useMemo(() => {
    if (!results?.warnings?.length) return [];
    return results.warnings.map((warning) => `${warning.providerName}: ${warning.message}`);
  }, [results]);

  const ensureGeocoded = async (location, label) => {
    if (typeof location.lat === 'number' && typeof location.lng === 'number') {
      return location;
    }
    if (!location.address) {
      throw new Error(`Enter a valid ${label} address.`);
    }
    const geocoded = await geocodeAddress(location.address);
    if (!geocoded) {
      throw new Error(`Unable to find ${label} location. Try a more specific address.`);
    }
    return { ...location, ...geocoded };
  };

  const handleCompare = async () => {
    setError(null);
    setLoading(true);
    try {
      const resolvedPickup = await ensureGeocoded(activePickup, 'pickup');
      const resolvedDestination = await ensureGeocoded(destination, 'destination');

      if (!selectedSuggestion) {
        setPickup(resolvedPickup);
      }
      setDestination(resolvedDestination);

      const data = await compareRides({
        pickup: resolvedPickup,
        destination: resolvedDestination,
      });

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const rides = results?.rides || [];
  const highlights = results?.highlights || {};

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">

        {/* ─── Header ─── */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">RideWise</p>
              <h1 className="text-4xl font-semibold md:text-5xl">
                Compare rides before you ride.
              </h1>
              <p className="mt-2 max-w-2xl text-base text-slate-600">
                Live price, wait time, and reliability intelligence across providers — with smart pickup suggestions to cut the wait.
              </p>
            </div>
            <div className="hidden rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 md:block">
              MVP demo
            </div>
          </div>
        </header>

        {/* ─── Notices ─── */}
        <NoticeBanner title="Provider usage notes" items={providerNotices} />
        <NoticeBanner title="Provider fetch warnings" items={warningMessages} />

        {/* ─── Search Panel ─── */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <LocationInputs
            pickup={pickup}
            destination={destination}
            onPickupChange={(value) => {
              setPickup(value);
              setSelectedSuggestion(null);
            }}
            onDestinationChange={setDestination}
          />

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-300"
              onClick={handleCompare}
              disabled={loading}
            >
              {loading ? 'Comparing...' : 'Compare rides'}
            </button>
            {error && <span className="text-sm font-semibold text-rose-600">{error}</span>}
            {selectedSuggestion && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Using suggested pickup
              </span>
            )}
          </div>
        </section>

        {/* ─── Map + Suggestions ─── */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <MapPanel
            pickup={activePickup}
            destination={destination}
            suggestions={results?.suggestions}
            selectedSuggestion={selectedSuggestion}
          />
          <PickupSuggestions
            suggestions={results?.suggestions}
            selectedId={selectedSuggestion?.id}
            onSelect={setSelectedSuggestion}
          />
        </section>

        {/* ─── Ride Comparison ─── */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Ride comparison</h2>
            <div className="text-sm text-slate-500">
              {rides.length ? `${rides.length} providers compared` : 'Awaiting query'}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rides.map((ride) => (
              <RideCard
                key={ride.providerId}
                ride={ride}
                isCheapest={highlights.cheapestProviderId === ride.providerId}
                isFastest={highlights.fastestProviderId === ride.providerId}
                isMostReliable={highlights.mostReliableProviderId === ride.providerId}
              />
            ))}
          </div>

          {!rides.length && !results && (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500">
              Enter a pickup and destination to see the best ride option.
            </div>
          )}
        </section>

        {/* ─── Footer ─── */}
        <footer className="text-center py-4 text-xs text-slate-500">
          RideWise is independent and not affiliated with Uber, Ola, or Rapido.
        </footer>
      </div>
    </div>
  );
}
