# RideWise - Ride Comparison Web App

**Compare rides. Book smarter.**

RideWise is a ride comparison platform for India that helps users decide which ride option is best before they book. Compare Uber, Ola, and Rapido in one place.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to project directory:**
   ```bash
   cd ridewise-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - The app will start at `http://localhost:5173`
   - Open this URL in your browser

---

## 📁 Project Structure

```
ridewise-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── LocationInput.jsx    # Pickup/destination autocomplete
│   │   ├── ProviderCard.jsx     # Uber/Ola/Rapido comparison card
│   │   ├── SmartPickup.jsx      # Smart pickup suggestion
│   │   ├── LoadingState.jsx     # Skeleton loading UI
│   │   ├── EmptyState.jsx       # No results found state
│   │   ├── TrustBanner.jsx      # Estimated data disclosure
│   │   └── MapView.jsx          # Map placeholder (Google Maps placeholder)
│   ├── data/
│   │   └── mockData.js          # Mock providers, locations, estimation logic
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles + Tailwind imports
├── tailwind.config.js           # Tailwind design tokens
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🎨 Features Implemented

### ✅ MVP Features (Working Now)

1. **Pickup + Destination Input**
   - Google Maps-style autocomplete
   - Mock location suggestions
   - Smooth dropdown interactions

2. **Ride Comparison**
   - 3 provider cards (Uber, Ola, Rapido)
   - Price ranges, ETAs
   - Badges: "Cheapest," "Fastest," "Most bikes"
   - Estimated data labels

3. **Smart Pickup Suggestions**
   - Shows nearby alternative pickup points
   - Displays savings (time + money)
   - One-tap to use alternative

4. **Loading States**
   - Skeleton UI with pulse animation
   - Smooth transitions

5. **Empty States**
   - No results found screen
   - Helpful suggestions

6. **Trust & Transparency**
   - Dismissible banner explaining estimated data
   - "Estimated" tags on all cards
   - Footer disclaimers

7. **Responsive Design**
   - Mobile-first layout
   - Desktop: Split view (cards + map)
   - Mobile: Stacked layout

8. **Deep Link Simulation**
   - Clicking "Book on [Provider]" shows alert with deep link info
   - Ready for production deep link integration

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** React hooks (useState)
- **Mock Data:** Custom estimation algorithm based on distance
- **Maps:** Placeholder (ready for Google Maps API)

---

## 🎨 Design System

### Colors

```javascript
Primary: #0D9488 (Teal)
Accent Green: #10B981 (Cheapest badge)
Accent Orange: #F97316 (Fastest badge)
Accent Blue: #3B82F6 (Reliable badge)
Background: #FAFAFA
Surface: #FFFFFF
Border: #E5E7EB
```

### Typography

- **Font:** Inter (Google Fonts)
- **Headings:** Bold, 700 weight
- **Body:** Regular, 400 weight
- **Small text:** 14px
- **Micro text:** 12px

### Spacing

- Card padding: 20px
- Section gaps: 24px
- Component spacing: 16px

---

## 🧪 How to Test

### 1. Landing Page
- See clean input fields
- Try typing in "Pickup" → Autocomplete dropdown appears
- Select a location → Field locks with selection

### 2. Compare Flow
- Enter "Koramangala" as pickup
- Enter "Indiranagar" as destination
- Click "Compare Rides"
- See 2.5-second loading animation
- Results appear with 3 provider cards

### 3. Provider Cards
- Check badges (Cheapest, Fastest)
- Verify price ranges and ETAs
- Click "Book on Ola" → Alert shows deep link info

### 4. Smart Pickup
- After results load, scroll down
- See "Smart Pickup Suggestion" card
- Shows savings (₹40, 5 min faster)
- Click "Use this pickup instead" → Re-triggers comparison

### 5. Mobile Testing
- Resize browser to mobile width (< 768px)
- Layout switches to stacked cards
- Map collapses (in placeholder state)

### 6. Edge Cases
- Try clicking "Compare Rides" without selecting locations → Alert appears
- Click "Edit route" → Returns to input page
- Dismiss trust banner → Stays dismissed

---

## 🔧 Customization

### Change Mock Data

Edit `src/data/mockData.js`:

```javascript
// Add new location
export const locationSuggestions = [
  {
    id: '7',
    name: 'Jayanagar',
    address: 'Jayanagar, Bangalore',
    area: 'South Bangalore',
    lat: 12.9250,
    lng: 77.5838,
  },
  // ... existing locations
];
```

### Adjust Estimation Logic

Edit `src/data/mockData.js`:

```javascript
const perKmRate = {
  ola: 12,    // Change base rate per km
  uber: 14,
  rapido: 8,
};
```

### Modify Brand Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    DEFAULT: '#0D9488', // Change primary color
  },
}
```

---

## 🚧 Next Steps (Post-MVP)

### Immediate Enhancements

1. **Google Maps Integration**
   - Add API key
   - Replace placeholder with real map
   - Show route polyline
   - Add draggable pins

2. **Live API Integration**
   - Connect to Uber/Ola/Rapido APIs (if available)
   - Switch from estimated to live data
   - Update badges to show "Live" instead of "Estimated"

3. **Deep Link Implementation**
   - Test deep links on mobile devices
   - Add fallback to web URLs if app not installed

### v2 Features (Roadmap)

- User accounts + saved routes
- Price history charts
- Surge prediction
- Push notifications
- Referral system
- Share comparison links

---

## 📱 Mobile App Considerations

This web app is designed to be **PWA-ready**:

- Add `manifest.json` for install prompt
- Service worker for offline support
- Native-like interactions

To convert to React Native:
- Components are already modular
- Replace Tailwind with StyleSheet
- Use React Native Maps for map view

---

## 🐛 Known Limitations (MVP)

1. **Mock Data Only**
   - All prices are estimated based on distance
   - No real-time provider data
   - Surge pricing is simulated

2. **No Persistence**
   - No user accounts
   - No saved routes
   - Trust banner dismissal doesn't persist across sessions

3. **Map Placeholder**
   - Static placeholder instead of real map
   - No interactive route visualization

4. **No Analytics**
   - No tracking of comparisons
   - No user behavior insights

---

## 📝 Production Checklist

Before deploying to production:

- [ ] Add Google Maps API key
- [ ] Implement real deep links (test on mobile)
- [ ] Add analytics (Google Analytics / Mixpanel)
- [ ] Set up error tracking (Sentry)
- [ ] Add SEO meta tags
- [ ] Optimize images/assets
- [ ] Add favicon
- [ ] Set up domain + SSL
- [ ] Test on real devices (iOS + Android)
- [ ] Add terms of service + privacy policy

---

## 🤝 Contributing

This is a startup MVP. Contributions welcome!

### Areas for Improvement

- Google Maps integration
- Provider API connections
- UX refinements
- Performance optimizations
- Accessibility improvements

---

## 📄 License

MIT License - feel free to use this for your startup!

---

## 💡 Questions?

**Product Designer:** Check `/docs` folder for full design specifications

**Developer:** All components are documented inline

**Startup Team:** See business strategy in main design doc

---

**Built with ❤️ for urban riders in India**
