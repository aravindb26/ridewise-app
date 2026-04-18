import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LocationInput from './components/LocationInput';
import ProviderCard from './components/ProviderCard';
import SmartPickup from './components/SmartPickup';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import TrustBanner from './components/TrustBanner';
import MapView from './components/MapView';
import { estimateRides, getSmartPickupSuggestion } from './data/mockData';
import rideWiseAPI from './services/api';

function App() {
  const [pickupInput, setPickupInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [estimates, setEstimates] = useState(null);
  const [smartPickup, setSmartPickup] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [apiAvailable, setApiAvailable] = useState(true);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      const health = await rideWiseAPI.checkHealth();
      setApiAvailable(health.status === 'ok');
    };
    checkBackend();
  }, []);

  const handleCompare = async () => {
    if (!pickup || !destination) {
      alert('Please select both pickup and destination');
      return;
    }

    setIsLoading(true);
    setShowResults(false);

    try {
      // Try to get live estimates from backend
      const result = await rideWiseAPI.getEstimates(pickup, destination);
      
      if (result.success) {
        // Use live data from API
        setEstimates(result.estimates);
        setRouteInfo(result.route);
        
        // Smart pickup suggestion (use existing logic)
        const smartSuggestion = getSmartPickupSuggestion(pickup, destination);
        setSmartPickup(smartSuggestion);
        
        setIsLoading(false);
        setShowResults(true);
      } else {
        // Fallback to mock data
        console.warn('API unavailable, using fallback estimates');
        useFallbackEstimates();
      }
    } catch (error) {
      console.error('Estimation failed:', error);
      useFallbackEstimates();
    }
  };

  const useFallbackEstimates = () => {
    // Use mock data as fallback
    setTimeout(() => {
      const rideEstimates = estimateRides(pickup, destination);
      const smartSuggestion = getSmartPickupSuggestion(pickup, destination);

      setEstimates(rideEstimates);
      setSmartPickup(smartSuggestion);
      setIsLoading(false);
      setShowResults(true);
    }, 1000);
  };

  const handleReset = () => {
    setPickupInput('');
    setDestinationInput('');
    setPickup(null);
    setDestination(null);
    setEstimates(null);
    setSmartPickup(null);
    setShowResults(false);
    setRouteInfo(null);
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

  // Open all provider sites with route pre-filled
  const handleOpenProviders = () => {
    if (!pickup || !destination) {
      alert('Please select pickup and destination first');
      return;
    }

    const providers = [
      {
        name: 'Uber',
        url: `https://m.uber.com/looking?pickup[latitude]=${pickup.lat}&pickup[longitude]=${pickup.lng}&dropoff[latitude]=${destination.lat}&dropoff[longitude]=${destination.lng}`
      },
      {
        name: 'Ola',
        url: `https://book.olacabs.com/?serviceType=p2p&lat=${pickup.lat}&lng=${pickup.lng}&drop_lat=${destination.lat}&drop_lng=${destination.lng}`
      },
      {
        name: 'Rapido',
        url: `https://www.rapido.bike/ride?pickup_lat=${pickup.lat}&pickup_lng=${pickup.lng}&drop_lat=${destination.lat}&drop_lng=${destination.lng}`
      }
    ];

    providers.forEach((p, index) => {
      setTimeout(() => window.open(p.url, '_blank'), index * 300);
    });
    
    alert('✅ Opened 3 tabs with your route!\n\nCheck exact prices there, then come back to compare.');
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
                📊 Compare Rides
              </button>

              {pickup && destination && (
                <button
                  onClick={handleOpenProviders}
                  className="w-full py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all"
                >
                  🔗 Check Real Prices on Apps
                </button>
              )}
            </div>

            {!apiAvailable && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Backend API unavailable. Using fallback estimates.
                </p>
              </div>
            )}

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
                  <p className="text-sm text-neutral-text-secondary">Calculating best routes...</p>
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
                    {routeInfo 
                      ? `${routeInfo.distance} km · ~${routeInfo.duration} min drive`
                      : 'Route calculated'}
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
                  {Object.entries(estimates).map(([key, estimate]) => (
                    <ProviderCard
                      key={key}
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

                {/* Add "Verify Prices" button after results */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">💡</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Want exact prices?
                      </h4>
                      <p className="text-sm text-blue-700 mb-3">
                        These are smart estimates. Click below to check real prices on each app.
                      </p>
                      <button
                        onClick={handleOpenProviders}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        🔗 Open All 3 Apps
                      </button>
                    </div>
                  </div>
                </div>
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
                Prices shown are smart estimates based on route data. Always check final price in the
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
