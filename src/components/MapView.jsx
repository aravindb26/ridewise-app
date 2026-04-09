import React from 'react';

const MapView = ({ pickup, destination, smartPickup }) => {
  // Mock map display using a placeholder
  // In production, integrate Google Maps API here

  return (
    <div className="bg-neutral-border rounded-xl overflow-hidden h-full min-h-[400px] flex items-center justify-center relative">
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🗺️</div>
        <p className="text-neutral-text-secondary text-sm mb-2">
          Route: {pickup?.name || 'Pickup'} → {destination?.name || 'Destination'}
        </p>
        <p className="text-neutral-text-muted text-xs">
          Google Maps integration placeholder
        </p>
        {smartPickup && (
          <div className="mt-4 p-3 bg-white rounded-lg inline-block">
            <div className="flex items-center space-x-2 text-sm">
              <span>⭐</span>
              <span className="font-medium">Smart pickup: {smartPickup.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Mock pins */}
      <div className="absolute top-8 left-8 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg">
        📍
      </div>
      <div className="absolute bottom-8 right-8 bg-accent-orange text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg">
        🚩
      </div>
      {smartPickup && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-status-warning text-white rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-lg">
          ⭐
        </div>
      )}
    </div>
  );
};

export default MapView;
