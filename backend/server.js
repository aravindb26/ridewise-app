const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function getRouteData(pickup, destination) {
  if (GOOGLE_MAPS_API_KEY) {
    try {
      const url = 'https://maps.googleapis.com/maps/api/directions/json';
      const response = await axios.get(url, {
        params: {
          origin: `${pickup.lat},${pickup.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          key: GOOGLE_MAPS_API_KEY,
          mode: 'driving',
          departure_time: 'now'
        },
        timeout: 10000
      });

      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const leg = route.legs[0];
        
        return {
          distance: leg.distance.value / 1000,
          duration: leg.duration_in_traffic ? leg.duration_in_traffic.value / 60 : leg.duration.value / 60,
          durationInTraffic: leg.duration_in_traffic ? leg.duration_in_traffic.value / 60 : null,
          polyline: route.overview_polyline?.points || null,
          isFallback: false,
          traffic: leg.duration_in_traffic ? true : false
        };
      }
      throw new Error(`Google Maps: ${response.data.status}`);
    } catch (error) {
      console.error('Google Maps error:', error.message);
      console.log('Falling back to straight-line distance...');
    }
  }
  
  const distance = calculateStraightLineDistance(pickup.lat, pickup.lng, destination.lat, destination.lng);
  return {
    distance: distance,
    duration: distance * 3,
    polyline: null,
    isFallback: true,
    traffic: false
  };
}

function calculateStraightLineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
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
}

function detectSurge() {
  const utc = new Date();
  const ist = new Date(utc.getTime() + (5.5 * 60 * 60 * 1000));
  const hour = ist.getHours();
  const day = ist.getDay();
  
  const isMorningRush = hour >= 8 && hour < 10 && day >= 1 && day <= 5;
  const isEveningRush = hour >= 17 && hour < 20 && day >= 1 && day <= 5;
  const isLateNight = hour >= 23 || hour < 2;
  const isWeekendPeak = (day === 5 || day === 6) && (hour >= 20 || hour < 2);
  
  if (isMorningRush || isEveningRush) return { active: true, multiplier: 1.5, reason: 'Rush hour' };
  if (isLateNight) return { active: true, multiplier: 1.3, reason: 'Late night' };
  if (isWeekendPeak) return { active: true, multiplier: 1.4, reason: 'Weekend peak' };
  
  return { active: false, multiplier: 1.0, reason: null };
}

function calculatePricing(distance, duration, surge) {
  const providers = {
    ola: { baseFare: 40, perKmRate: 12, perMinRate: 1.5, platformFee: 5, variability: 0.15 },
    uber: { baseFare: 35, perKmRate: 14, perMinRate: 2, platformFee: 10, variability: 0.12 },
    rapido: { baseFare: 20, perKmRate: 7, perMinRate: 0.5, platformFee: 0, variability: 0.10 }
  };

  const estimates = {};
  
  Object.keys(providers).forEach(provider => {
    const config = providers[provider];
    let basePrice = config.baseFare + (distance * config.perKmRate) + (duration * config.perMinRate) + config.platformFee;
    basePrice *= surge.multiplier;
    
    estimates[provider] = {
      priceMin: Math.round(basePrice * (1 - config.variability)),
      priceMax: Math.round(basePrice * (1 + config.variability)),
      etaMin: Math.floor(duration * 0.8),
      etaMax: Math.ceil(duration * 1.2),
      surge: surge.active ? { multiplier: surge.multiplier, reason: surge.reason } : null
    };
  });
  
  const sortedByPrice = Object.entries(estimates).sort((a, b) => ((a[1].priceMin + a[1].priceMax) / 2) - ((b[1].priceMin + b[1].priceMax) / 2));
  const sortedByEta = Object.entries(estimates).sort((a, b) => ((a[1].etaMin + a[1].etaMax) / 2) - ((b[1].etaMin + b[1].etaMax) / 2));
  
  estimates[sortedByPrice[0][0]].badge = 'Cheapest';
  estimates[sortedByEta[0][0]].badge = 'Fastest';
  
  return estimates;
}

app.post('/api/estimate', async (req, res) => {
  try {
    const { pickup, destination } = req.body;
    if (!pickup || !destination) return res.status(400).json({ error: 'Pickup and destination required' });
    
    const routeData = await getRouteData(pickup, destination);
    const surge = detectSurge();
    const estimates = calculatePricing(routeData.distance, routeData.duration, surge);
    
    res.json({
      success: true,
      route: {
        distance: routeData.distance.toFixed(1),
        duration: Math.round(routeData.duration),
        durationInTraffic: routeData.durationInTraffic ? Math.round(routeData.durationInTraffic) : null,
        polyline: routeData.polyline,
        isFallback: routeData.isFallback || false,
        traffic: routeData.traffic || false
      },
      estimates,
      surge,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Estimation error:', error);
    res.status(500).json({ error: 'Failed to calculate estimates', message: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    routingProvider: GOOGLE_MAPS_API_KEY ? 'Google Maps Directions API (traffic-aware)' : 'Fallback (straight-line)',
    hasGoogleMapsKey: !!GOOGLE_MAPS_API_KEY,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ RideWise Backend running on port ${PORT}`);
  if (GOOGLE_MAPS_API_KEY) {
    console.log(`🗺️  Routing: Google Maps Directions API - Traffic-aware`);
  } else {
    console.log(`⚠️  No Google Maps API key - Using fallback routing`);
  }
  console.log(`🔗 Test: http://localhost:${PORT}/health`);
});
