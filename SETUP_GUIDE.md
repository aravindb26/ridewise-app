# RideWise Setup Guide

## Step-by-Step Instructions to Run the App

### Option 1: Run Locally (Recommended)

#### Step 1: Check Prerequisites

Open terminal and verify Node.js is installed:

```bash
node --version
```

You should see something like `v18.x.x` or higher.

If not installed, download from: https://nodejs.org

---

#### Step 2: Navigate to Project

```bash
cd ridewise-app
```

---

#### Step 3: Install Dependencies

```bash
npm install
```

This will take 1-2 minutes. You'll see:
```
added 151 packages, and audited 152 packages in 32s
```

---

#### Step 4: Start Development Server

```bash
npm run dev
```

You'll see:
```
VITE v5.x.x ready in X ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

#### Step 5: Open in Browser

1. Copy the URL: `http://localhost:5173`
2. Paste into your browser (Chrome, Firefox, Safari, Edge)
3. Press Enter

**The app is now running!**

---

### Option 2: Build for Production

If you want to create a deployable version:

```bash
npm run build
```

This creates a `dist/` folder with optimized files ready for deployment.

---

## What You'll See

### 1. Landing Page

![Landing Page]
- Clean input fields for pickup and destination
- "Compare Rides" button
- Tagline: "Compare rides. Book smarter."

### 2. Autocomplete

Type in the pickup field:
- Type "Kora" → See "Koramangala" suggestion
- Type "Indi" → See "Indiranagar" suggestion
- Click any suggestion to select it

### 3. Loading State

After clicking "Compare Rides":
- 3 skeleton cards with pulse animation
- Text: "Finding best rides..."
- Duration: 2.5 seconds

### 4. Results Screen

After loading completes:
- **3 provider cards:**
  - Ola (with "Cheapest" badge)
  - Uber (with "Fastest" badge)
  - Rapido
- Each card shows:
  - Price range (₹180-₹220)
  - ETA (8-12 min)
  - "Estimated ~" tag
  - "Book on [Provider]" button

- **Map placeholder** (right side on desktop)
  - Shows route visualization placeholder
  - Pickup pin, destination pin
  - Smart pickup star (if applicable)

- **Smart Pickup section** (below cards)
  - "Walk 2 min to 80 Feet Road"
  - "Save ₹40 • Arrive 5 min faster"
  - "Use this pickup instead" button

- **Trust banner** (yellow, at top)
  - "These are estimated prices..."
  - Dismissible with X button

### 5. Mobile View

Resize browser to mobile width:
- Cards stack vertically
- Map collapses
- All interactions work the same

---

## Testing Scenarios

### Test Case 1: Basic Flow

1. Enter "Koramangala" as pickup
2. Enter "Indiranagar" as destination
3. Click "Compare Rides"
4. Wait 2.5 seconds
5. See results with 3 provider cards
6. Click "Book on Ola"
7. See alert with deep link info

**Expected:** Smooth flow, no errors

---

### Test Case 2: Smart Pickup

1. Complete Test Case 1
2. Scroll down to "Smart Pickup Suggestion"
3. Click "Use this pickup instead"
4. See new comparison with updated pickup

**Expected:** Re-triggers comparison with new location

---

### Test Case 3: Edit Route

1. Complete Test Case 1
2. Click "✏️ Edit route" (top-right)
3. Input fields reappear
4. Enter new locations
5. Click "Compare Rides" again

**Expected:** Returns to input page, allows new search

---

### Test Case 4: Empty Input

1. On landing page, don't select any locations
2. Click "Compare Rides"
3. See alert: "Please select both pickup and destination"

**Expected:** Validation prevents empty searches

---

### Test Case 5: Responsive Design

1. Open app on desktop (full width)
2. See split layout (cards left, map right)
3. Resize browser to mobile width (< 768px)
4. See stacked layout (cards above map)

**Expected:** Layout adapts smoothly

---

## Troubleshooting

### Problem: "npm: command not found"

**Solution:** Install Node.js from https://nodejs.org

---

### Problem: Port 5173 already in use

**Solution:** Kill existing process or change port:

```bash
npm run dev -- --port 3000
```

---

### Problem: Blank white screen

**Solution:** Check browser console (F12):
1. Look for error messages
2. Ensure all files were created correctly
3. Try refreshing (Ctrl+R or Cmd+R)

---

### Problem: Autocomplete not working

**Solution:** 
1. Type at least 2 characters
2. Wait 0.5 seconds for suggestions
3. Check that `mockData.js` has location data

---

### Problem: Styles not loading

**Solution:**
1. Verify `tailwind.config.js` exists
2. Run `npm install` again
3. Restart dev server

---

## File Checklist

Verify all these files exist:

```
ridewise-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx ✓
│   │   ├── LocationInput.jsx ✓
│   │   ├── ProviderCard.jsx ✓
│   │   ├── SmartPickup.jsx ✓
│   │   ├── LoadingState.jsx ✓
│   │   ├── EmptyState.jsx ✓
│   │   ├── TrustBanner.jsx ✓
│   │   └── MapView.jsx ✓
│   ├── data/
│   │   └── mockData.js ✓
│   ├── App.jsx ✓
│   ├── main.jsx ✓
│   └── index.css ✓
├── tailwind.config.js ✓
├── postcss.config.js ✓
├── package.json ✓
├── index.html ✓
└── README.md ✓
```

---

## Next Steps After Setup

1. **Customize branding:**
   - Change colors in `tailwind.config.js`
   - Update logo in `Header.jsx`

2. **Add more locations:**
   - Edit `src/data/mockData.js`
   - Add cities beyond Bangalore

3. **Integrate Google Maps:**
   - Get API key from Google Cloud Console
   - Replace `MapView.jsx` placeholder with real map

4. **Connect to real APIs:**
   - Set up backend server
   - Add API endpoints for Uber/Ola/Rapido

5. **Deploy to production:**
   - Run `npm run build`
   - Deploy `dist/` folder to Vercel/Netlify/your hosting

---

## Support

**Stuck? Check:**
1. Browser console (F12) for errors
2. Terminal for build errors
3. README.md for feature details
4. This guide for common issues

**Still stuck?**
- Verify Node.js version (18+)
- Try deleting `node_modules/` and `package-lock.json`, then `npm install` again
- Check that all files from the File Checklist exist

---

**Good luck! 🚀**
