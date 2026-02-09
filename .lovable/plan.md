

# Visual Upgrade: Mansa Stays Premium Dark Theme

## Overview

You're absolutely right - the **Directory** and **Business Detail** pages have a rich, immersive "Premium Dark" aesthetic that the Mansa Stays pages are missing. This plan brings visual parity across the platform.

---

## Current State Comparison

| Element | Directory/Business Pages | Mansa Stays Pages |
|---------|-------------------------|-------------------|
| **Hero Header** | Animated gradient orbs, golden accent line, font-mono badge, motion animations | Basic gradient, simple stats, minimal animation |
| **Search Bar** | Glassmorphic with animated glow, AI badge, dropdown results | Basic filter bar with solid borders |
| **Section Headers** | Gold gradient text, decorative accents | Plain white text |
| **Cards** | 3D hover effects, featured spotlight, premium badges | Good glassmorphism, but less polish |
| **Grid Lines** | Subtle background grid overlay | Has grid, but less refined |
| **Typography** | Tracking-widest uppercase badges | Standard text styling |

---

## Implementation Plan

### 1. Vacation Rentals Landing Page (`VacationRentalsPage.tsx`)

**Hero Section Upgrade:**
- Add the golden accent bar at the top (matching Directory)
- Add the font-mono decorative badge ("Discover - Support - Stay")
- Upgrade the title with gold gradient text effect
- Add framer-motion entrance animations
- Enhance the animated gradient orbs (more variation, additional orbs)

**Search Bar Upgrade:**
- Replace `PropertyFilters` inline styling with a new `PremiumPropertySearchBar` component
- Add the animated glow effect on focus (matching Directory)
- Glassmorphic styling with `backdrop-blur-xl`

**Results Section:**
- Add the pulsing gold dot + "X properties found" styling
- Add a featured property spotlight section (like `FeaturedSpotlight`)

### 2. Property Detail Page (`PropertyDetailPage.tsx`)

**Hero Section:**
- Add sticky header with glassmorphic blur (like BusinessDetailPage)
- Add animated gradient orbs throughout the page
- Add decorative corner gradients

**Info Cards:**
- Add the glassmorphic card styling with golden border accents
- Upgrade badges with glowing effects

### 3. Guest Bookings Page (`GuestBookingsPage.tsx`)

**Note:** This page already uses `DashboardLayout` which has a different pattern. We'll update it to match the standalone page aesthetic when accessed via `/stays/my-bookings`.

**Upgrades:**
- Add the animated gradient background
- Add the golden accent bar
- Upgrade card styling with premium hover effects

### 4. Create New Premium Components

**`PremiumPropertySearchBar.tsx`** - Matching `PremiumSearchBar`:
- Animated glow on focus
- AI badge for natural language queries
- Glassmorphic dropdown results
- Motion animations

**`FeaturedPropertySpotlight.tsx`** - Matching `FeaturedSpotlight`:
- Highlight a top-rated or verified property
- Crown badge, sparkle effects
- Premium CTA button with shadow

---

## Visual Diagram

```text
+--------------------------------------------------+
|  ============ GOLD ACCENT LINE ============      |
+--------------------------------------------------+
|                                                  |
|     [ Animated Gradient Orbs Background ]        |
|                                                  |
|          * Discover - Support - Stay *           |  <- font-mono badge
|                                                  |
|           MANSA STAYS                            |  <- Gold gradient text
|    Book unique vacation rentals...               |
|                                                  |
|     [===== PREMIUM SEARCH BAR =====]             |  <- Animated glow
|       Location | Dates | Guests | Filters        |
|                                                  |
|   * 24 properties found ----------------------   |  <- Pulsing dot
|                                                  |
|   +-- FEATURED PROPERTY SPOTLIGHT --+            |
|   |  Crown Badge | Premium CTA      |            |
|   +----------------------------------+           |
|                                                  |
|   [Property Cards with Enhanced Hover Effects]   |
|                                                  |
+--------------------------------------------------+
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/VacationRentalsPage.tsx` | Major update - add premium styling |
| `src/pages/PropertyDetailPage.tsx` | Add sticky header, orbs, premium cards |
| `src/pages/GuestBookingsPage.tsx` | Add standalone premium layout option |
| `src/components/stays/PremiumPropertySearchBar.tsx` | **New** - Premium search component |
| `src/components/stays/FeaturedPropertySpotlight.tsx` | **New** - Featured property highlight |
| `src/components/vacation-rentals/PropertyCard.tsx` | Minor - enhance hover effects |

---

## Technical Details

### Reusable Patterns from Directory

**Animated Gradient Orbs:**
```tsx
<div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/30 to-blue-600/30 rounded-full blur-3xl animate-float" />
<div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/25 to-amber-500/25 rounded-full blur-3xl animate-pulse" />
```

**Gold Accent Line:**
```tsx
<div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent opacity-60" />
```

**Font-Mono Badge:**
```tsx
<span className="text-mansagold text-sm font-mono tracking-widest uppercase bg-mansagold/10 px-4 py-2 rounded-full border border-mansagold/20">
  Discover - Support - Stay
</span>
```

**Gold Gradient Title:**
```tsx
<span className="text-transparent bg-clip-text bg-gradient-to-r from-mansagold via-amber-400 to-mansagold">
  Mansa Stays
</span>
```

**Pulsing Results Counter:**
```tsx
<div className="h-2 w-2 rounded-full bg-mansagold animate-pulse" />
<span className="text-mansagold font-bold text-xl">{count}</span>
```

---

## Outcome

After implementation, Mansa Stays will have:
- Consistent "Premium Dark" identity across all pages
- Enhanced user experience with smooth animations
- Visual parity with Directory/Business pages
- Professional, polished appearance that reinforces the 1325.AI brand

