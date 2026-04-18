// RideWise API Service
// Connects frontend to backend for real-time estimates

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const rideWiseAPI = {
  /**
   * Get ride estimates from backend
   * @param {Object} pickup - { lat, lng, name, address }
   * @param {Object} destination - { lat, lng, name, address }
   * @returns {Promise<Object>} Estimates for all providers
   */
  async getEstimates(pickup, destination) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pickup, destination }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform backend response to frontend format
      return {
        success: true,
        route: data.route,
        estimates: transformEstimates(data.estimates),
        surge: data.surge,
        isLive: !data.route.isFallback,
        timestamp: data.timestamp
      };
    } catch (error) {
      console.error('API call failed:', error);
      // Return fallback data if backend is unavailable
      return {
        success: false,
        error: error.message,
        useFallback: true
      };
    }
  },

  /**
   * Health check
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'error', error: error.message };
    }
  }
};

/**
 * Transform backend estimates to frontend format
 */
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

  Object.keys(backendEstimates).forEach(providerKey => {
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
      surgeReason: estimate.surge ? estimate.surge.reason : null
    };
  });

  return transformed;
}

export default rideWiseAPI;
