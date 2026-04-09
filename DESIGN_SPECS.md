# RideWise Design Specifications

## Complete Visual & UX Specifications

---

## 1. Design Tokens

### Colors

```css
/* Primary (Brand) */
--color-primary: #0D9488;
--color-primary-light: #14B8A6;
--color-primary-dark: #0F766E;

/* Accents */
--color-accent-green: #10B981;   /* Cheapest badge */
--color-accent-orange: #F97316;   /* Fastest badge */
--color-accent-blue: #3B82F6;     /* Most Reliable badge */

/* Neutrals */
--color-bg: #FAFAFA;
--color-surface: #FFFFFF;
--color-border: #E5E7EB;
--color-text-primary: #1F2937;
--color-text-secondary: #6B7280;
--color-text-muted: #9CA3AF;

/* Status */
--color-estimated: #D1D5DB;
--color-live: #10B981;
--color-error: #EF4444;
--color-warning: #F59E0B;

/* Provider Brand Colors */
--color-ola: #00A86B;
--color-uber: #000000;
--color-rapido: #FFD500;
```

### Typography

```css
/* Font Family */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Font Sizes */
--font-size-h1: 40px;
--font-size-h2: 32px;
--font-size-h3: 24px;
--font-size-h4: 20px;
--font-size-body: 16px;
--font-size-small: 14px;
--font-size-micro: 12px;

/* Font Weights */
--font-weight-regular: 400;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line Heights */
--line-height-heading: 1.2;
--line-height-body: 1.5;
```

### Spacing

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

### Shadows

```css
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-card-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
--shadow-dropdown: 0 4px 12px rgba(0, 0, 0, 0.15);
```

### Border Radius

```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

---

## 2. Component Specifications

### Header

**Desktop:**
- Height: 64px
- Background: #FFFFFF
- Border-bottom: 1px solid #E5E7EB
- Padding: 0 32px
- Logo: 24px font, bold, left-aligned
- Nav links: 14px, right-aligned, 24px spacing

**Mobile:**
- Height: 56px
- Logo: centered
- Hamburger menu: right-aligned

---

### Location Input

**Container:**
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border radius: 8px
- Padding: 16px
- Focus state: Border #0D9488, ring 2px #0D9488 20% opacity

**Icon:**
- Size: 24px
- Pickup: 📍 (teal)
- Destination: 🚩 (orange)

**Input field:**
- Font size: 16px
- Placeholder color: #9CA3AF
- No border (contained within outer container)

**Autocomplete dropdown:**
- Appears 8px below input
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
- Max height: 256px
- Scrollable

**Suggestion item:**
- Padding: 12px 16px
- Hover background: #0D9488 5% opacity
- Border-bottom: 1px solid #E5E7EB (except last)
- Main text: 14px, bold, #1F2937
- Subtext: 12px, regular, #6B7280

---

### Provider Card

**Container:**
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border radius: 12px
- Padding: 20px
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- Hover: Shadow 0 4px 12px rgba(0, 0, 0, 0.15), scale 1.02

**Winner card (with badge):**
- Border: 2px solid #0D9488

**Header section:**
- Logo: 32px emoji
- Name: 16px, bold
- Badge: Pill shape, 6px radius, 4px vertical padding, 8px horizontal padding

**Price:**
- Font size: 32px
- Font weight: bold
- Color: #1F2937

**ETA:**
- Font size: 16px
- Font weight: regular
- Color: #6B7280

**Tags (Estimated, Surge):**
- Pill shape, 6px radius
- Font size: 12px, bold
- Padding: 4px 8px
- Estimated: Background #D1D5DB, text #6B7280
- Surge: Background #F59E0B 20%, text #F59E0B

**Book button:**
- Width: 100%
- Height: 48px
- Border radius: 8px
- Font: 14px, bold, white
- Background: Provider brand color
- Hover: Darken 10%

---

### Smart Pickup Card

**Container:**
- Background: #FFFFFF
- Border: 1px solid #0D9488 30%
- Border radius: 12px
- Padding: 20px
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)

**Icon:**
- 💡 (20px, left-aligned with title)

**Title:**
- Font: 18px, bold
- Color: #1F2937

**Main text:**
- Font: 16px, semibold
- Color: #1F2937

**Savings row:**
- Icons: ⚡ ⏱ (14px)
- Font: 14px, medium
- Color: #10B981

**Button:**
- Border: 2px solid #0D9488
- Background: transparent
- Text color: #0D9488
- Hover: Background #0D9488, text white
- Height: 40px
- Border radius: 8px
- Font: 14px, semibold

---

### Trust Banner

**Container:**
- Background: #FEF3C7 (light yellow)
- Border-left: 4px solid #F59E0B (amber)
- Border radius: 8px
- Padding: 16px
- Flex layout: icon | text | dismiss button

**Icon:**
- ⓘ (20px, amber)

**Text:**
- Font: 14px, regular
- Color: #1F2937
- Link: Bold, amber, underline on hover

**Dismiss button:**
- × (20px, #9CA3AF)
- Hover: #1F2937

---

### Loading State (Skeleton)

**Skeleton card:**
- Background: #FFFFFF
- Border: 1px solid #E5E7EB
- Border radius: 12px
- Padding: 20px
- Contains grey rectangles with pulse animation

**Pulse animation:**
- Opacity: 0.4 → 0.7 → 0.4
- Duration: 1.5s
- Infinite loop

**Grey blocks:**
- Background: #E5E7EB
- Border radius: 4px

---

### Empty State

**Container:**
- Background: #FFFFFF
- Border radius: 12px
- Padding: 32px
- Text align: center
- Max width: 448px
- Centered

**Icon:**
- 🛺 (96px)

**Headline:**
- Font: 20px, bold
- Color: #1F2937
- Margin: 16px top

**Text:**
- Font: 14px, regular
- Color: #6B7280
- Text align: left
- List items: Bullet points

**Button:**
- Width: 100%
- Height: 48px
- Background: #0D9488
- Text: white, bold
- Border radius: 8px

---

### Map View

**Container:**
- Background: #E5E7EB (placeholder)
- Border radius: 12px
- Minimum height: 400px
- Display: flex, center items

**Pins:**
- Pickup: 📍 (teal circle, 40px, white icon)
- Destination: 🚩 (orange circle, 40px, white icon)
- Smart pickup: ⭐ (yellow circle, 40px, white icon)

**Route line:**
- Color: #0D9488
- Width: 4px
- Style: solid

---

## 3. Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  /* Single column layout */
  /* Stacked cards */
  /* Map collapses/hidden */
  /* Font sizes -2px */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Two column grid */
  /* Reduced spacing */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Three column grid (2 cards + 1 map) */
  /* Full spacing */
  /* Max width: 1200px */
}

/* Large Desktop */
@media (min-width: 1440px) {
  /* Max width: 1280px */
  /* Extra side margins */
}
```

---

## 4. Animation Specifications

### Button Hover

```css
transition: transform 0.2s, box-shadow 0.2s;
hover: transform scale(1.02);
active: transform scale(0.98);
```

### Card Hover

```css
transition: box-shadow 0.2s, border-color 0.2s;
hover: box-shadow 0 4px 12px rgba(0, 0, 0, 0.15);
```

### Dropdown Appear

```css
animation: fadeIn 0.2s ease-in-out;

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Skeleton Pulse

```css
animation: pulse 1.5s ease-in-out infinite;

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
```

---

## 5. Interaction States

### Button States

**Default:**
- Background: brand color
- Cursor: pointer

**Hover:**
- Background: darken 10%
- Scale: 1.02
- Shadow: enhance

**Active (pressed):**
- Scale: 0.98

**Disabled:**
- Background: #D1D5DB
- Cursor: not-allowed
- Opacity: 0.6

### Input States

**Default:**
- Border: #E5E7EB

**Focus:**
- Border: #0D9488
- Ring: 2px #0D9488 20% opacity

**Error:**
- Border: #EF4444
- Ring: 2px #EF4444 20% opacity

**Disabled:**
- Background: #F3F4F6
- Cursor: not-allowed

---

## 6. Mobile Adaptations

### Layout Changes

**Desktop (1024px+):**
- Split view: 60% cards, 40% map
- Horizontal comparison cards
- Map sticky on scroll

**Mobile (<768px):**
- Single column
- Stacked cards (100% width)
- Map collapsed by default
- "View map" button expands to 300px height

### Touch Targets

**Minimum size:** 44×44px
**Spacing:** 8px between tappable elements
**Buttons:** Larger padding (16px vertical)

### Typography Adjustments

**Mobile:**
- H1: 28px (vs 40px desktop)
- H2: 24px (vs 32px desktop)
- Body: 14px (vs 16px desktop)

---

## 7. Accessibility Specifications

### Color Contrast

All text meets WCAG AA standards:
- Primary text on white: 4.5:1 minimum
- Secondary text on white: 4.5:1 minimum
- White text on primary: 4.5:1 minimum

### Keyboard Navigation

**Tab order:**
1. Logo / Skip to main
2. Nav links
3. Pickup input
4. Destination input
5. Compare button
6. Provider cards (each)
7. Smart pickup button
8. Footer links

**Focus indicators:**
- 2px solid outline, primary color
- Offset: 2px

### Screen Reader Support

**Required attributes:**
- `<button>` with descriptive text
- `<input>` with `aria-label`
- `<img>` with `alt` text (when real images added)
- Landmark roles: `<header>`, `<main>`, `<footer>`

---

## 8. Error States

### Network Error

**Message:** "Oops! Something went wrong. Please try again."

**Action:** "Retry" button

**Visual:** Red error icon

### Location Permission Denied

**Message:** "We need your location to compare rides."

**Actions:**
- "Enable Location" (primary)
- "Enter Manually" (secondary)

**Visual:** Map pin with X icon

### No Results

**Message:** "Hmm, we couldn't find rides for this route."

**Suggestions:**
- Try a nearby pickup
- Check destination
- Limited service notice

**Action:** "Try Again" button

---

## 9. Microcopy Guidelines

### Tone

- **Helpful, not salesy:** "Here's the best option" ✓ vs "Book now!" ✗
- **Clear, not technical:** "₹40 cheaper" ✓ vs "17% cost reduction" ✗
- **Honest, not misleading:** "Estimated" ✓ vs "Real-time*" ✗

### Key Phrases

**Headlines:**
- "Compare rides. Book smarter."
- "Finding best rides..."
- "Smart Pickup Suggestion"

**Buttons:**
- "Compare Rides" (primary action)
- "Book on [Provider]" (conversion action)
- "Use this pickup instead" (alternative action)

**Disclaimers:**
- "These are estimated prices. Actual prices may vary."
- "Always check final price in the provider app."

**Empty states:**
- "Hmm, we couldn't find rides..."
- "Try: A nearby pickup location"

---

## 10. Design Files Export

### For Handoff

**Export from this doc:**
1. Component measurements
2. Color codes
3. Font specifications
4. Spacing values

**Create in Figma (optional):**
1. Import design tokens as styles
2. Build component library
3. Create responsive frames
4. Add prototype interactions

---

**Design system complete. Ready for development or design tool import.**
