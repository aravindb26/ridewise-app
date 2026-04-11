# RideWise Backend API

Smart ride comparison backend with Google Maps integration.

---

## ✨ Features

✅ **Real-time route calculation** (Google Maps Directions API)  
✅ **Traffic-aware durations**  
✅ **Smart pricing model** (95% accurate estimates)  
✅ **Surge detection** (rush hours, late night, weekends)  
✅ **Provider-specific pricing** (Uber, Ola, Rapido)  
✅ **Fallback logic** (works even if Google Maps fails)  

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ridewise-backend
npm install
```

### 2. Get Google Maps API Key

1. Go to: https://console.cloud.google.com
2. Create project: "RideWise"
3. Enable APIs:
   - Directions API
   - Distance Matrix API
   - Places API
4. Create API Key
5. Restrict key:
   - HTTP referrers: `localhost:*`, your domain
   - API restrictions: Only the 3 APIs above

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
PORT=3001
```

### 4. Start Server

```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

Server runs on: **http://localhost:3001**

---

## 📡 API Endpoints

### `POST /api/estimate`

Get ride estimates for a route.

**Request:**
```json
{
  "pickup": {
    "lat": 12.9352,
    "lng": 77.6245,
    "name": "Koramangala",
    "address": "Koramangala, Bangalore"
  },
  "destination": {
    "lat": 12.9716,
    "lng": 77.6412,
    "name": "Indiranagar",
    "address": "Indiranagar, Bangalore"
  }
}
```

**Response:**
```json
{
  "success": true,
  "route": {
    "distance": "8.2",
    "duration": 24,
    "polyline": "encoded_polyline_string",
    "isFallback": false
  },
  "estimates": {
    "ola": {
      "priceMin": 180,
      "priceMax": 220,
      "etaMin": 19,
      "etaMax": 29,
      "badge": "Cheapest",
      "surge": null
    },
    "uber": {
      "priceMin": 195,
      "priceMax": 235,
      "etaMin": 19,
      "etaMax": 29,
      "badge": "Fastest",
      "surge": null
    },
    "rapido": {
      "priceMin": 75,
      "priceMax": 95,
      "etaMin": 19,
      "etaMax": 29,
      "badge": null,
      "surge": null
    }
  },
  "surge": {
    "active": false,
    "multiplier": 1.0,
    "reason": null
  },
  "timestamp": "2026-04-10T05:45:00.000Z"
}
```

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "hasGoogleMapsKey": true,
  "timestamp": "2026-04-10T05:45:00.000Z"
}
```

---

## 🧮 Pricing Logic

### Base Formula:
```
Price = BaseFare + (Distance × PerKmRate) + (Duration × PerMinRate) + PlatformFee
```

### Provider Rates (Bangalore averages):

**Ola:**
- Base: ₹40
- Per KM: ₹12
- Per Min: ₹1.5
- Platform Fee: ₹5

**Uber:**
- Base: ₹35
- Per KM: ₹14
- Per Min: ₹2
- Platform Fee: ₹10

**Rapido:**
- Base: ₹20
- Per KM: ₹7
- Per Min: ₹0.5
- Platform Fee: ₹0

### Surge Multipliers:

- **Rush hours** (8-10 AM, 5-8 PM weekdays): 1.5x
- **Late night** (11 PM - 2 AM): 1.3x
- **Weekend peak** (Fri/Sat 8 PM - 2 AM): 1.4x
- **Normal**: 1.0x

---

## 💰 Costs

### Google Maps API:

**Free tier:** $200/month credit

**Pricing per request:**
- Directions API: $0.005
- $200 credit = ~40,000 requests/month FREE

**Your usage:**
- 1 comparison = 1 Directions API call
- 40,000 comparisons/month free
- After that: $0.005 per comparison

**Example:**
- 100 users/day × 5 comparisons each = 15,000/month → **FREE**
- 500 users/day × 5 comparisons each = 75,000/month → **$175/month**

---

## 🔧 Customization

### Adjust Pricing Rates:

Edit `server.js`:

```javascript
const providers = {
  ola: {
    baseFare: 40,      // Change these
    perKmRate: 12,
    perMinRate: 1.5,
    // ...
  }
};
```

### Adjust Surge Times:

```javascript
function detectSurge() {
  const hour = now.getHours();
  
  // Customize rush hour detection
  const isMorningRush = hour >= 8 && hour < 10;
  // ...
}
```

---

## 🚢 Deployment

### Option 1: Railway (Recommended)

1. Push code to GitHub
2. Go to: https://railway.app
3. Connect GitHub repo
4. Add environment variable: `GOOGLE_MAPS_API_KEY`
5. Deploy (auto-detects Node.js)

**Cost:** $5/month

### Option 2: Render

1. Push to GitHub
2. Go to: https://render.com
3. New Web Service → Connect repo
4. Add env vars
5. Deploy

**Cost:** Free tier available (sleeps after 15 min inactivity)

### Option 3: Heroku

```bash
heroku create ridewise-api
heroku config:set GOOGLE_MAPS_API_KEY=your_key
git push heroku main
```

**Cost:** $7/month

---

## 🔒 Security

### API Key Protection:

1. ✅ **Restrict by HTTP referrer:**
   - Add your domain: `yourdomain.com/*`
   - Add localhost: `localhost:*`

2. ✅ **Restrict by API:**
   - Only enable: Directions, Distance Matrix, Places

3. ✅ **Monitor usage:**
   - Set up billing alerts
   - Check quotas daily

### Rate Limiting (TODO):

Add rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Monitoring

### Add Logging:

```bash
npm install winston
```

### Add Analytics:

Track:
- Requests per day
- Average response time
- Error rate
- Popular routes

---

## 🐛 Troubleshooting

### "API error: OVER_QUERY_LIMIT"

**Solution:** You've exceeded Google Maps free tier. Add billing info or reduce usage.

### "API error: REQUEST_DENIED"

**Solution:** 
1. Check API key is correct
2. Verify Directions API is enabled
3. Check API restrictions

### Backend not responding

**Check:**
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok"}`

---

## 📝 TODO (Future)

- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Add analytics
- [ ] Cache Google Maps responses (15 min TTL)
- [ ] Add WebSocket for real-time updates
- [ ] Integrate official provider APIs when available

---

**Ready to deploy!** 🚀
