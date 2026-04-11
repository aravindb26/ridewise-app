const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// OSRM (OpenStreetMap-based routing - 100% FREE, no API key needed)
// Uses public demo servers. For production, use your own OSRM instance.
const OSRM_SERVERS = [
  'https://router.project-osrm.org/route/v1/driving',
];

async function getRouteData(pickup, destination) {
  try {
    const server = OSRM_SERVERS[0];
    const url = `${server}/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}`;
    
    const response = await axios.get(url, {
      params: {
        overview: 'full',
        geometries: 'polyline',
        steps: false,
        annotations: 'duration,distance'
      },
      timeout: 10000
    });

    if (response.data.code !== 'Ok' || !response.data.routes[0]) {
      throw new Error(`OSRM error: ${response.data.code}`);
    }

    const route = response.data.routes[0];
    
    return {
      distance: route.distance / 1000, // meters to km
      duration: route.duration / 60,   // seconds to minutes
      polyline: route.geometry
    };
  } catch (error) {
    console.error('OSRM routing error:', error.message);
    console.log('Falling back to straight-line distance...');
    
    // Fallback: Calculate straight-line distance
    const distance = calculateStraightLineDistance(
      pickup.lat, pickup.lng, 
      destination.lat, destination.lng
    );
    return {
      distance: distance,
      duration: distance * 3, // Rough estimate: 20 km/h avg
      polyline: null,
      isFallback: true
    };
  }
}

// Haversine formula for fallback
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

// Surge detection based on time (Indian time zone: IST = UTC+5:30)
function detectSurge() {
  // Convert current UTC to IST
  const utc = new Date();
  const ist = new Date(utc.getTime() + (5.5 * 60 * 60 * 1000));
  
  const hour = ist.getHours();
  const day = ist.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Morning rush: 8-10 AM on weekdays
  const isMorningRush = hour >= 8 && hour < 10 && day >= 1 && day <= 5;
  
  // Evening rush: 5-8 PM on weekdays  
  const isEveningRush = hour >= 17 && hour < 20 && day >= 1 && day <= 5;
  
  // Late night: 11 PM - 2 AM (any day)
  const isLateNight = hour >= 23 || hour < 2;
  
  // Weekend peak: Friday/Saturday 8 PM - 2 AM
  const isWeekendPeak = (day === 5 || day === 6) && (hour >= 20 || hour < 2);
  
  if (isMorningRush || isEveningRush) {
    return { active: true, multiplier: 1.5, reason: 'Rush hour' };
  }
  
  if (isLateNight) {
    return { active: true, multiplier: 1.3, reason: 'Late night' };
  }
  
  if (isWeekendPeak) {
    return { active: true, multiplier: 1.4, reason: 'Weekend peak' };
  }
  
  return { active: false, multiplier: 1.0, reason: null };
}

// Smart pricing model
function calculatePricing(distance, duration, surge) {
  // Provider-specific rates (based on India averages)
  const providers = {
    ola: {
      baseFare: 40,
      perKmRate: 12,
      perMinRate: 1.5,
      platformFee: 5,
      variability: 0.15
    },
    uber: {
      baseFare: 35,
      perKmRate: 14,
      perMinRate: 2,
      platformFee: 10,
      variability: 0.12
    },
    rapido: {
      baseFare: 20,
      perKmRate: 7,
      perMinRate: 0.5,
      platformFee: 0,
      variability: 0.10
    }
  };

  const estimates = {};
  
  Object.keys(providers).forEach(provider => {
    const config = providers[provider];
    
    // Base calculation
    let basePrice = 
      config.baseFare + 
      (distance * config.perKmRate) + 
      (duration * config.perMinRate) +
      config.platformFee;
    
    // Apply surge
    basePrice *= surge.multiplier;
    
    // Create price range
    const priceMin = Math.round(basePrice * (1 - config.variability));
    const priceMax = Math.round(basePrice * (1 + config.variability));
    
    // ETA range (duration ± 20%)
    const etaMin = Math.floor(duration * 0.8);
    const etaMax = Math.ceil(duration * 1.2);
    
    estimates[provider] = {
      priceMin,
      priceMax,
      etaMin,
      etaMax,
      surge: surge.active ? {
        multiplier: surge.multiplier,
        reason: surge.reason
      } : null
    };
  });
  
  // Determine badges
  const sortedByPrice = Object.entries(estimates).sort((a, b) => {
    const aAvg = (a[1].priceMin + a[1].priceMax) / 2;
    const bAvg = (b[1].priceMin + b[1].priceMax) / 2;
    return aAvg - bAvg;
  });
  
  const sortedByEta = Object.entries(estimates).sort((a, b) => {
    const aAvg = (a[1].etaMin + a[1].etaMax) / 2;
    const bAvg = (b[1].etaMin + b[1].etaMax) / 2;
    return aAvg - bAvg;
  });
  
  estimates[sortedByPrice[0][0]].badge = 'Cheapest';
  estimates[sortedByEta[0][0]].badge = 'Fastest';
  
  return estimates;
}

// Main estimate endpoint
app.post('/api/estimate', async (req, res) => {
  try {
    const { pickup, destination } = req.body;
    
    if (!pickup || !destination) {
      return res.status(400).json({ error: 'Pickup and destination required' });
    }
    
    // Get route data from OpenStreetMap (OSRM)
    const routeData = await getRouteData(pickup, destination);
    
    // Detect surge
    const surge = detectSurge();
    
    // Calculate pricing
    const estimates = calculatePricing(routeData.distance, routeData.duration, surge);
    
    res.json({
      success: true,
      route: {
        distance: routeData.distance.toFixed(1),
        duration: Math.round(routeData.duration),
        polyline: routeData.polyline,
        isFallback: routeData.isFallback || false
      },
      estimates,
      surge,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Estimation error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate estimates',
      message: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    routingProvider: 'OpenStreetMap (OSRM)',
    cost: 'FREE - No API key required',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ RideWise Backend running on port ${PORT}`);
  console.log(`🗺️  Routing: OpenStreetMap (OSRM) - 100% FREE`);
  console.log(`🔗 Test: http://localhost:${PORT}/health`);
});
