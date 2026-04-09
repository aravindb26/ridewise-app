# RideWise Visual Walkthrough

## What You'll See Step-by-Step

---

## Screen 1: Landing Page

### What you see:
```
┌──────────────────────────────────────────┐
│  📍 RideWise    How it Works | FAQ       │ ← Header
├──────────────────────────────────────────┤
│                                          │
│        Compare rides. Book smarter.      │ ← Big headline
│    See Uber, Ola, and Rapido side-by-side│ ← Subheadline
│                                          │
│   ┌────────────────────────────────────┐ │
│   │ 📍 Where are you?                  │ │ ← Pickup input
│   └────────────────────────────────────┘ │
│   ────────────────────────────────────── │ ← Divider
│   ┌────────────────────────────────────┐ │
│   │ 🚩 Where to?                       │ │ ← Destination input
│   └────────────────────────────────────┘ │
│                                          │
│        [Compare Rides Button - Teal]     │ ← Big button
│                                          │
│   Trusted by 10,000+ riders in Bangalore │ ← Social proof
│                                          │
└──────────────────────────────────────────┘
```

### Colors:
- **Background:** Very light grey (#FAFAFA)
- **Input card:** Pure white with subtle shadow
- **Button:** Teal (#0D9488)
- **Text:** Dark grey (#1F2937)

---

## Screen 2: Autocomplete Dropdown

### What happens when you type:

**You type: "Kora"**

```
┌────────────────────────────────────┐
│ 📍 Kora|                           │ ← Your cursor
└────────────────────────────────────┘
        ↓
┌────────────────────────────────────┐
│ 📍 Koramangala                     │ ← Suggestion appears
│    Koramangala, Bangalore          │
│    South Bangalore                 │
├────────────────────────────────────┤
│ (other suggestions if they match)  │
└────────────────────────────────────┘
```

**Interaction:**
- Type → Suggestions appear instantly
- Click suggestion → Input fills, dropdown closes
- Hover → Light teal background highlight

---

## Screen 3: Loading State

### What you see after clicking "Compare Rides":

```
┌──────────────────────────────────────────┐
│  Koramangala → Indiranagar   ✏️ Edit     │ ← Route info
├──────────────────────────────────────────┤
│                                          │
│        Finding best rides...             │ ← Loading message
│                                          │
│   ┌────────────────────────────────────┐ │
│   │ [Grey pulsing rectangle]           │ │ ← Skeleton card 1
│   │ [Grey pulsing rectangle]           │ │
│   │ [Grey pulsing rectangle]           │ │
│   └────────────────────────────────────┘ │
│                                          │
│   ┌────────────────────────────────────┐ │
│   │ [Grey pulsing rectangle]           │ │ ← Skeleton card 2
│   └────────────────────────────────────┘ │
│                                          │
│   ┌────────────────────────────────────┐ │
│   │ [Grey pulsing rectangle]           │ │ ← Skeleton card 3
│   └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

**Animation:**
- Grey boxes pulse (fade in/out)
- Duration: 2.5 seconds
- Smooth, professional loading effect

---

## Screen 4: Results (Desktop View)

### Full comparison results:

```
┌──────────────────────────────────────────────────────────────┐
│  📍 RideWise              How it Works | FAQ                 │
├──────────────────────────────────────────────────────────────┤
│  Koramangala → Indiranagar                    ✏️ Edit route  │
│  8.2 km · ~15 min drive                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Yellow banner: "These are estimated prices..."]     [×]   │
│                                                              │
├────────────────────────────┬─────────────────────────────────┤
│  LEFT SIDE (60%)           │  RIGHT SIDE (40%)               │
│                            │                                 │
│  ┌──────────────────────┐ │  ┌───────────────────────────┐  │
│  │ 🟢 Ola   [Cheapest]  │ │  │                           │  │
│  │ ₹180 - ₹220          │ │  │       🗺️                  │  │
│  │ ETA: 8-12 min        │ │  │      MAP                  │  │
│  │ [Estimated ~]        │ │  │    PLACEHOLDER            │  │
│  │                      │ │  │                           │  │
│  │ [Book on Ola - Green]│ │  │   📍 Pickup pin           │  │
│  └──────────────────────┘ │  │   🚩 Destination pin      │  │
│                            │  │   ⭐ Smart pickup star    │  │
│  ┌──────────────────────┐ │  │                           │  │
│  │ ⚫ Uber  [Fastest]    │ │  └───────────────────────────┘  │
│  │ ₹200 - ₹240          │ │                                 │
│  │ ETA: 5-8 min         │ │                                 │
│  │ [Estimated ~]        │ │                                 │
│  │                      │ │                                 │
│  │ [Book on Uber-Black] │ │                                 │
│  └──────────────────────┘ │                                 │
│                            │                                 │
│  ┌──────────────────────┐ │                                 │
│  │ 🟡 Rapido            │ │                                 │
│  │ ₹60 - ₹80            │ │                                 │
│  │ ETA: 10-15 min       │ │                                 │
│  │ [Estimated ~]        │ │                                 │
│  │                      │ │                                 │
│  │ [Book Rapido-Yellow] │ │                                 │
│  └──────────────────────┘ │                                 │
│                            │                                 │
│  💡 Smart Pickup Suggestion │                                 │
│  ┌──────────────────────┐ │                                 │
│  │ Walk 2 min to        │ │                                 │
│  │ 80 Feet Road         │ │                                 │
│  │ ⚡ Save ₹40          │ │                                 │
│  │ ⏱ Arrive 5 min faster│ │                                 │
│  │                      │ │                                 │
│  │ [Use this pickup]    │ │                                 │
│  └──────────────────────┘ │                                 │
└────────────────────────────┴─────────────────────────────────┘
```

### Key Visual Details:

**Ola Card (Winner):**
- **Border:** 2px teal (highlighted)
- **Badge:** Green pill "Cheapest"
- **Button:** Ola green (#00A86B)

**Uber Card:**
- **Border:** 1px grey (normal)
- **Badge:** Orange pill "Fastest"
- **Button:** Black

**Rapido Card:**
- **Border:** 1px grey
- **No badge** (not winner)
- **Button:** Yellow (#FFD500) with dark text

**Smart Pickup:**
- **Border:** 1px teal 30% opacity
- **Icon:** 💡 lightbulb
- **Savings:** Green text with icons
- **Button:** Outlined teal

---

## Screen 5: Results (Mobile View)

### Same content, stacked layout:

```
┌──────────────┐
│ 📍 RideWise  │ ← Header (compact)
│         ✏️   │
├──────────────┤
│ Koramangala  │
│ → Indiranagar│ ← Route info
├──────────────┤
│ 🗺️ View map  │ ← Collapsed map (expandable)
├──────────────┤
│ [Yellow      │ ← Trust banner
│  banner]  [×]│
├──────────────┤
│ 🟢 Ola       │
│ [Cheapest]   │
│ ₹180-₹220    │ ← Card 1 (full width)
│ ETA: 8-12min │
│ [Estimated]  │
│ [Book on Ola]│
├──────────────┤
│ ⚫ Uber       │
│ [Fastest]    │
│ ₹200-₹240    │ ← Card 2 (full width)
│ ETA: 5-8 min │
│ [Estimated]  │
│ [Book Uber]  │
├──────────────┤
│ 🟡 Rapido    │
│ ₹60-₹80      │ ← Card 3 (full width)
│ ETA: 10-15min│
│ [Estimated]  │
│ [Book Rapido]│
├──────────────┤
│ 💡 Smart     │
│ Pickup       │
│ Walk 2 min   │ ← Smart pickup (full width)
│ Save ₹40     │
│ [Use this]   │
└──────────────┘
```

**Mobile Adaptations:**
- Cards stack vertically
- Map collapses (expand with button)
- Larger tap targets (48px min)
- Readable on 320px width screens

---

## Screen 6: Empty State

### When no results are found:

```
┌──────────────────────────────────────────┐
│                                          │
│                                          │
│              🛺                           │ ← Large icon
│                                          │
│    Hmm, we couldn't find rides          │ ← Headline
│    for this route.                       │
│                                          │
│    Try:                                  │
│    • A nearby pickup location            │ ← Suggestions
│    • Double-check your destination       │
│    • Some areas have limited service     │
│                                          │
│         [Try Again - Teal Button]        │ ← Action
│                                          │
└──────────────────────────────────────────┘
```

**Feel:**
- Friendly (not alarming)
- Helpful (gives suggestions)
- Actionable (clear next step)

---

## Screen 7: What Clicking "Book on Ola" Does

### Alert simulation:

```
┌────────────────────────────────────┐
│  Opening Ola app...                │
│                                    │
│  Deep link: olacabs://app          │
│  Fallback: https://book.olacabs.com│
│                                    │
│              [OK]                  │
└────────────────────────────────────┘
```

**In production:**
- Mobile: Opens Ola app (if installed)
- Desktop: Opens Ola website
- Route pre-filled from comparison

---

## Color Reference (What You'll Actually See)

### Primary Colors:
- **Teal buttons:** #0D9488 (RideWise brand)
- **Green badge:** #10B981 (Cheapest)
- **Orange badge:** #F97316 (Fastest)

### Provider Colors:
- **Ola button:** #00A86B (green)
- **Uber button:** #000000 (black)
- **Rapido button:** #FFD500 (yellow)

### Neutrals:
- **Background:** #FAFAFA (very light grey)
- **Cards:** #FFFFFF (pure white)
- **Borders:** #E5E7EB (light grey)
- **Text:** #1F2937 (dark grey)

### Status:
- **Estimated tag:** #D1D5DB background, grey text
- **Trust banner:** #FEF3C7 background, amber border

---

## Typography (What Fonts You'll See)

### Headings:
- **Landing headline:** 40px bold "Compare rides. Book smarter."
- **Route info:** 24px bold "Koramangala → Indiranagar"
- **Provider names:** 18px bold "Ola"

### Body Text:
- **Prices:** 32px bold "₹180 - ₹220"
- **ETAs:** 16px regular "ETA: 8-12 min"
- **Tags:** 12px bold "Estimated ~"

### Font Family:
- **Inter** (Google Fonts) - clean, modern, readable

---

## Interactions You Can Test

### 1. Hover Effects

**Provider Cards:**
- Hover → Shadow lifts, slight scale up
- Smooth 0.2s transition

**Buttons:**
- Hover → Darkens 10%, cursor pointer
- Active (click) → Scales down 98%

### 2. Focus States

**Input Fields:**
- Click → Teal border + glow
- Type → Autocomplete appears

### 3. Animations

**Loading:**
- Pulse animation (grey boxes fade in/out)
- 1.5 second loop

**Page Transitions:**
- Fade in when results appear
- Smooth 0.2s ease

---

## Browser Testing

### Works Best In:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

### Tested Screen Sizes:
- ✅ Mobile: 320px - 767px
- ✅ Tablet: 768px - 1023px
- ✅ Desktop: 1024px+
- ✅ Large: 1440px+

---

## What to Notice

### Good Design Details:

1. **Whitespace:** Generous padding, never cramped
2. **Hierarchy:** Clear visual order (price > ETA > tags)
3. **Consistency:** Same card layout for all 3 providers
4. **Responsiveness:** Works on any screen size
5. **Feedback:** Every interaction has visual response
6. **Trust:** Honest labels, clear disclaimers

---

## Final Visual Check

### Open the app and verify:

✓ **Header:** Logo + nav links, white background  
✓ **Landing:** Clean, centered, white input card  
✓ **Autocomplete:** Smooth dropdown, hover states  
✓ **Loading:** Grey pulse animation, 3 cards  
✓ **Results:** Split layout (desktop) or stacked (mobile)  
✓ **Cards:** Price bold, badges colored, buttons branded  
✓ **Map:** Placeholder with pins visible  
✓ **Smart Pickup:** Lightbulb icon, green savings text  
✓ **Trust Banner:** Yellow background, dismissible  
✓ **Footer:** Links, disclaimers, grey text  

---

**Everything should look polished, modern, and production-ready!**

If something looks off, check:
1. Browser zoom (should be 100%)
2. Dark mode (app is light mode only)
3. Console for errors (F12)

**Enjoy exploring the app! 🎨**
