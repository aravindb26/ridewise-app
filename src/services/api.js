// RideWise API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const rideWiseAPI = {
  async getEstimates(pickup, destination) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickup, destination }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      return {
        success: true,
        route: data.route,
        estimates: transformEstimates(data.estimates),
        surge: data.surge,
        isLive: !data.route.isFallback,
        timestamp: data.timestamp,
      };
    } catch (error) {
      console.error('API call failed:', error);
      return { success: false, error: error.message, useFallback: true };
    }
  },

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  },

  // Google Places autocomplete suggestions
  async autocomplete(input, sessionToken) {
    const response = await fetch(
      `${API_BASE_URL}/api/places/autocomplete?input=${encodeURIComponent(input)}` +
        (sessionToken ? `&sessionToken=${sessionToken}` : ''),
      { headers: { Accept: 'application/json' } }
    );
    const data = await response.json();
    return data.predictions || [];
  },

  // Get place details (lat, lng, name)
  async getPlaceDetails(placeId, sessionToken) {
    const response = await fetch(
      `${API_BASE_URL}/api/places/details?place_id=${placeId}` +
        (sessionToken ? `&sessionToken=${sessionToken}` : ''),
      { headers: { Accept: 'application/json' } }
    );
    const data = await response.json();
    if (data.result?.geometry) {
      return {
        lat: data.result.geometry.location.lat,
        lng: data.result.geometry.location.lng,
        name: data.result.name || data.result.formatted_address,
        address: data.result.formatted_address,
      };
    }
    return null;
  },
};

function transformEstimates(backendEstimates) {
  const providers = {
    uber_auto: {
      id: 'uber_auto',
      name: 'Uber Auto',
      logo: '🟠',
      brandColor: '#FF6B00',
      deepLinkBase: 'uber://',
      webFallback: 'https://m.uber.com',
    },
    uber_go: {
      id: 'uber_go',
      name: 'Uber Go',
      logo: '⚫',
      brandColor: '#276EF1',
      deepLinkBase: 'uber://',
      webFallback: 'https://m.uber.com',
    },
    ola_auto: {
      id: 'ola_auto',
      name: 'Ola Auto',
      logo: '🟢',
      brandColor: '#06B05F',
      deepLinkBase: 'olacabs://app',
      webFallback: 'https://book.olacabs.com',
    },
    rapido_bike: {
      id: 'rapido_bike',
      name: 'Rapido Bike',
      logo: '🟡',
      brandColor: '#FFD500',
      deepLinkBase: 'rapido://',
      webFallback: 'https://rapido.bike',
    },
  };

  const transformed = {};

  Object.keys(backendEstimates).forEach((providerKey) => {
    const estimate = backendEstimates[providerKey];
    transformed[providerKey] = {
      provider: providers[providerKey] || {
        id: providerKey,
        name: providerKey,
        logo: '🚗',
        brandColor: '#0F83C0',
      },
      priceMin: estimate.priceMin,
      priceMax: estimate.priceMax,
      etaMin: estimate.etaMin,
      etaMax: estimate.etaMax,
      badge: estimate.badge || null,
      isEstimated: false,
      isSurge: !!estimate.surge,
      surgeMultiplier: estimate.surge ? estimate.surge.multiplier : 1.0,
      surgeReason: estimate.surge ? estimate.surge.reason : null,
    };
  });

  return transformed;
}

export default rideWiseAPI;
