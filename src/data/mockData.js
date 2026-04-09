// Mock provider data
export const providers = {
  ola: {
    id: 'ola',
    name: 'Ola',
    logo: '🟢',
    brandColor: '#00A86B',
    deepLinkBase: 'olacabs://app',
    webFallback: 'https://book.olacabs.com',
  },
  uber: {
    id: 'uber',
    name: 'Uber',
    logo: '⚫',
    brandColor: '#000000',
    deepLinkBase: 'uber://',
    webFallback: 'https://m.uber.com',
  },
  rapido: {
    id: 'rapido',
    name: 'Rapido',
    logo: '🟡',
    brandColor: '#FFD500',
    deepLinkBase: 'rapido://',
    webFallback: 'https://rapido.bike',
  },
};

// Mock location suggestions for autocomplete
export const locationSuggestions = [
  {
    id: '1',
    name: 'Koramangala',
    address: 'Koramangala, Bangalore',
    area: 'South Bangalore',
    lat: 12.9352,
    lng: 77.6245,
  },
  {
    id: '2',
    name: 'Indiranagar',
    address: 'Indiranagar, Bangalore',
    area: 'East Bangalore',
    lat: 12.9716,
    lng: 77.6412,
  },
  {
    id: '3',
    name: 'MG Road',
    address: 'MG Road, Bangalore',
    area: 'Central Bangalore',
    lat: 12.9759,
    lng: 77.6061,
  },
  {
    id: '4',
    name: 'Whitefield',
    address: 'Whitefield, Bangalore',
    area: 'East Bangalore',
    lat: 12.9698,
    lng: 77.7500,
  },
  {
    id: '5',
    name: 'HSR Layout',
    address: 'HSR Layout, Bangalore',
    area: 'South Bangalore',
    lat: 12.9116,
    lng: 77.6385,
  },
  {
    id: '6',
    name: 'Electronic City',
    address: 'Electronic City, Bangalore',
    area: 'South Bangalore',
    lat: 12.8456,
    lng: 77.6603,
  },
];

// Function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Mock ride estimation function
export const estimateRides = (pickup, destination) => {
  const distance = calculateDistance(
    pickup.lat,
    pickup.lng,
    destination.lat,
    destination.lng
  );

  // Base fare calculation (simplified)
  const baseFare = 40;
  const perKmRate = {
    ola: 12,
    uber: 14,
    rapido: 8,
  };

  const estimates = {
    ola: {
      provider: providers.ola,
      priceMin: Math.round(baseFare + distance * perKmRate.ola * 0.9),
      priceMax: Math.round(baseFare + distance * perKmRate.ola * 1.2),
      etaMin: Math.round(distance * 2.5),
      etaMax: Math.round(distance * 3.5),
      isEstimated: true,
      isSurge: false,
      surgeMultiplier: 1.0,
    },
    uber: {
      provider: providers.uber,
      priceMin: Math.round(baseFare + distance * perKmRate.uber * 0.85),
      priceMax: Math.round(baseFare + distance * perKmRate.uber * 1.15),
      etaMin: Math.round(distance * 2),
      etaMax: Math.round(distance * 3),
      isEstimated: true,
      isSurge: false,
      surgeMultiplier: 1.0,
    },
    rapido: {
      provider: providers.rapido,
      priceMin: Math.round(baseFare * 0.7 + distance * perKmRate.rapido * 0.85),
      priceMax: Math.round(baseFare * 0.7 + distance * perKmRate.rapido * 1.2),
      etaMin: Math.round(distance * 3),
      etaMax: Math.round(distance * 4.5),
      isEstimated: true,
      isSurge: false,
      surgeMultiplier: 1.0,
    },
  };

  // Determine badges
  const sorted = Object.values(estimates).sort((a, b) => {
    const aMid = (a.priceMin + a.priceMax) / 2;
    const bMid = (b.priceMin + b.priceMax) / 2;
    return aMid - bMid;
  });

  sorted[0].badge = 'Cheapest';

  const fastestSorted = Object.values(estimates).sort((a, b) => {
    const aEta = (a.etaMin + a.etaMax) / 2;
    const bEta = (b.etaMin + b.etaMax) / 2;
    return aEta - bEta;
  });

  fastestSorted[0].badge = 'Fastest';

  return estimates;
};

// Mock smart pickup suggestion
export const getSmartPickupSuggestion = (pickup, destination) => {
  // Simulate finding a better pickup point
  const suggestions = [
    {
      id: 'smart-1',
      name: '80 Feet Road',
      address: '80 Feet Road, 200m from your location',
      lat: pickup.lat + 0.002,
      lng: pickup.lng + 0.001,
      walkingTime: 2,
      priceSavings: 40,
      timeSavings: 5,
      reason: 'Better road access and more drivers nearby',
    },
  ];

  // Only show if there's meaningful savings
  const distance = calculateDistance(
    pickup.lat,
    pickup.lng,
    destination.lat,
    destination.lng
  );

  return distance > 3 ? suggestions[0] : null;
};
