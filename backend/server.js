const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ─── Google Places (autocomplete for any address/name) ───

app.get('/api/places/autocomplete', async (req, res) => {
  try {
    const { input } = req.query;
    if (!input || input.length < 2) return res.json({ predictions: [] });
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input,
        key: GOOGLE_MAPS_API_KEY,
        types: ['(cities)'],
        componentRestrictions: { country: 'in' },
        language: 'en',
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/places/details', async (req, res) => {
  try {
    const { place_id } = req.query;
    if (!place_id) return res.status(400).json({ error: 'place_id required' });
    const { data } = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: { place_id, key: GOOGLE_MAPS_API_KEY, fields: 'geometry,name,formatted_address' },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Route / Pricing ───

async function getRouteData(pickup, destination) {
  if (GOOGLE_MAPS_API_KEY) {
    try {
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin: `${pickup.lat},${pickup.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          key: GOOGLE_MAPS_API_KEY,
          mode: 'driving',
          departure_time: 'now',
        },
        timeout: 10000,
      });
      if (data.status === 'OK' && data.routes.length > 0) {
        const leg = data.routes[0].legs[0];
        return {
          distance: leg.distance.value / 1000,
          duration: leg.duration_in_traffic
            ? leg.duration_in_traffic.value / 60
            : leg.duration.value / 60,
          durationInTraffic: leg.duration_in_traffic
            ? leg.duration_in_traffic.value / 60
            : null,
          polyline: data.routes[0].overview_polyline?.points || null,
          isFallback: false,
          traffic: !!leg.duration_in_traffic,
        };
      }
    } catch (e) {
      console.error('Google Maps error:', e.message);
    }
  }
  // Fallback
  const d = haversine(pickup.lat, pickup.lng, destination.lat, destination.lng);
  return {
    distance: d,
    duration: d * 3,
    polyline: null,
    isFallback: true,
    traffic: false,
  };
}

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function detectSurge() {
  const utc = new Date();
  const ist = new Date(utc.getTime() + 5.5 * 60 * 60 * 1000);
  const h = ist.getHours(),
    d = ist.getDay();
  if (h >= 8 && h < 10 && d >= 1 && d <= 5)
    return { active: true, multiplier: 1.5, reason: 'Rush hour' };
  if (h >= 17 && h < 20 && d >= 1 && d <= 5)
    return { active: true, multiplier: 1.5, reason: 'Rush hour' };
  if (h >= 23 || h < 2) return { active: true, multiplier: 1.3, reason: 'Late night' };
  if ((d === 5 || d === 6) && (h >= 20 || h < 2))
    return { active: true, multiplier: 1.4, reason: 'Weekend peak' };
  return { active: false, multiplier: 1 };
}

function calculatePricing(distance, duration, surge) {
  const providers = {
    uber_auto: {
      label: 'Uber Auto', icon: '🟠', baseFare: 35, perKmRate: 11.5, perMinRate: 1.1,
      minFare: 45, platformFee: 10, variability: 0.06, bias: 0.616,
    },
    uber_go: {
      label: 'Uber Go', icon: '⚫', baseFare: 45, perKmRate: 8.5, perMinRate: 1.6,
      minFare: 60, platformFee: 15, variability: 0.06, bias: 1.152,
    },
    ola_auto: {
      label: 'Ola Auto', icon: '🟢', baseFare: 40, perKmRate: 12, perMinRate: 1.2,
      minFare: 50, platformFee: 5, variability: 0.08, bias: 0.628,
    },
    rapido_bike: {
      label: 'Rapido Bike', icon: '🟡', baseFare: 20, perKmRate: 7, perMinRate: 0.5,
      minFare: 35, platformFee: 0, variability: 0.08, bias: 0.760,
    },
  };

  const estimates = {};
  for (const [key, p] of Object.entries(providers)) {
    let price = p.baseFare + distance * p.perKmRate + duration * p.perMinRate + p.platformFee;
    price = Math.max(price, p.minFare) * surge.multiplier * p.bias;
    estimates[key] = {
      label: p.label, icon: p.icon,
      priceMin: Math.round(price * (1 - p.variability)),
      priceMax: Math.round(price * (1 + p.variability)),
      etaMin: Math.floor(duration * 0.8), etaMax: Math.ceil(duration * 1.2),
      surge: surge.active ? { multiplier: surge.multiplier, reason: surge.reason } : null,
    };
  }

  const sorted = Object.entries(estimates).sort(
    (a, b) => (a[1].priceMin + a[1].priceMax) / 2 - (b[1].priceMin + b[1].priceMax) / 2
  );
  estimates[sorted[0][0]].badge = 'Cheapest';

  const sortedEta = [...sorted].sort(
    (a, b) => (a[1].etaMin + a[1].etaMax) / 2 - (b[1].etaMin + b[1].etaMax) / 2
  );
  estimates[sortedEta[0][0]].badge = 'Fastest';

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
        isFallback: routeData.isFallback,
        traffic: routeData.traffic,
      },
      estimates, surge, timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate estimates', message: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    routingProvider: GOOGLE_MAPS_API_KEY ? 'Google Maps Directions API' : 'Fallback',
    hasGoogleMapsKey: !!GOOGLE_MAPS_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`RideWise Backend on port ${PORT}`);
});
SERVEROF

echo "✅ server.js rebuilt"