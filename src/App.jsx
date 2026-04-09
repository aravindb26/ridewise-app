import React, { useState } from 'react';
import Header from './components/Header';
import LocationInput from './components/LocationInput';
import ProviderCard from './components/ProviderCard';
import SmartPickup from './components/SmartPickup';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import TrustBanner from './components/TrustBanner';
import MapView from './components/MapView';
import { estimateRides, getSmartPickupSuggestion } from './data/mockData';

function App() {
  const [pickupInput, setPickupInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [estimates, setEstimates] = useState(null);
  const [smartPickup, setSmartPickup] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleCompare = () => {
    if (!pickup || !destination) {
      alert('Please select both pickup and destination');
      return;
    }

    setIsLoading(true);
    setShowResults(false);

    // Simulate API call delay
    setTimeout(() => {
      const rideEstimates = estimateRides(pickup, destination);
      const smartSuggestion = getSmartPickupSuggestion(pickup, destination);

      setEstimates(rideEstimates);
      setSmartPickup(smartSuggestion);
      setIsLoading(false);
      setShowResults(true);
    }, 2500);
  };

  const handleReset = () => {
    setPickupInput('');
    setDestinationInput('');
    setPickup(null);
    setDestination(null);
    setEstimates(null);
    setSmartPickup(null);
    setShowResults(false);
  };

  const handleUseSmartPickup = () => {
    if (smartPickup) {
      setPickup({
        ...smartPickup,
        name: smartPickup.name,
        address: smartPickup.address,
      });
      setPickupInput(smartPickup.name);
      handleCompare();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {!showResults && !isLoading && (
          <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-text-primary mb-4">
                Compare rides. Book smarter.
              </h2>
              <p className="text-lg text-neutral-text-secondary">
                See Uber, Ola, and Rapido side-by-side before you book.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6 space-y-4">
              <LocationInput
                type="pickup"
                value={pickupInput}
                onChange={setPickupInput}
                onSelect={(loc) => {
                  setPickup(loc);
                  setPickupInput(loc.name);
                }}
              />

              <div className="h-px bg-neutral-border"></div>

              <LocationInput
                type="destination"
                value={destinationInput}
                onChange={setDestinationInput}
                onSelect={(loc) => {
                  setDestination(loc);
                  setDestinationInput(loc.name);
                }}
              />

              <button
                onClick={handleCompare}
                disabled={!pickup || !destination}
                className="w-full py-4 rounded-lg bg-primary text-white font-bold text-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Compare Rides
              </button>
            </div>

            <p className="text-center text-sm text-neutral-text-muted mt-6">
              Trusted by 10,000+ riders in Bangalore, Delhi, and Mumbai
            </p>
          </div>
        )}

        {isLoading && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-neutral-text-primary">
                    {pickup?.name} → {destination?.name}
                  </h3>
                  <p className="text-sm text-neutral-text-secondary">Calculating...</p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-primary hover:underline"
                >
                  ✏️ Edit route
                </button>
              </div>
            </div>
            <LoadingState />
          </div>
        )}

        {showResults && estimates && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-neutral-text-primary">
                    {pickup?.name} → {destination?.name}
                  </h3>
                  <p className="text-sm text-neutral-text-secondary">
                    {(
                      Math.sqrt(
                        Math.pow(destination.lat - pickup.lat, 2) +
                          Math.pow(destination.lng - pickup.lng, 2)
                      ) * 111
                    ).toFixed(1)}{' '}
                    km · ~
                    {Math.round(
                      Math.sqrt(
                        Math.pow(destination.lat - pickup.lat, 2) +
                          Math.pow(destination.lng - pickup.lng, 2)
                      ) *
                        111 *
                        3
                    )}{' '}
                    min drive
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  ✏️ Edit route
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TrustBanner />

                <div className="space-y-4">
                  {Object.values(estimates).map((estimate) => (
                    <ProviderCard
                      key={estimate.provider.id}
                      estimate={estimate}
                      isWinner={!!estimate.badge}
                    />
                  ))}
                </div>

                {smartPickup && (
                  <SmartPickup
                    suggestion={smartPickup}
                    onUse={handleUseSmartPickup}
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-20">
                  <MapView
                    pickup={pickup}
                    destination={destination}
                    smartPickup={smartPickup}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-neutral-border mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-neutral-text-muted text-center md:text-left">
              <p>
                RideWise is an independent comparison tool. We are not affiliated
                with Uber, Ola, or Rapido.
              </p>
              <p className="mt-1">
                Prices shown are estimates. Always check final price in the
                provider app before booking.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-neutral-text-secondary hover:text-primary">
                About
              </a>
              <a href="#" className="text-neutral-text-secondary hover:text-primary">
                FAQ
              </a>
              <a href="#" className="text-neutral-text-secondary hover:text-primary">
                Privacy
              </a>
              <a href="#" className="text-neutral-text-secondary hover:text-primary">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
