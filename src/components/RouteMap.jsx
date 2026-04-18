import React from 'react';

export default function RouteMap({ pickup, destination }) {
  // Simple Google Maps iframe — free, no billing required
  if (!pickup || !destination) {
    return (
      <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-sm">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          Map preview appears here
        </div>
      </div>
    );
  }

  const params = new URLSearchParams();
  params.set('origin', `${pickup.name}`);
  params.set('destination', `${destination.name}`);
  params.set('travelmode', 'driving');

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md border border-border">
      <iframe
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&origin=${pickup.lat},${pickup.lng}&destination=${destination.lat},${destination.lng}&mode=driving`}
        title="Route Map"
      />
    </div>
  );
}
