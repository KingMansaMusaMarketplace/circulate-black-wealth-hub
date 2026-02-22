

# Noir Travel - Homepage CTA + Landing Page

## Overview
Add **Noir** as the third branded vertical on the homepage, following the proven pattern established by **Mansa Stays**. Noir will have both a homepage CTA card and a dedicated `/noir` landing page.

## Homepage Placement

The homepage section order will become:

1. Hero
2. MissionPreview
3. **VacationRentalsCTA (Mansa Stays)**
4. **NoirRideCTA (NEW)** -- right after Stays, grouping the two branded verticals together
5. ThreePillars
6. FeaturedBusinesses
7. CTASection
8. CirculationGap

The Noir CTA card will mirror the Mansa Stays card design (glassmorphic card, two-column layout with content + image) but with its own luxury black/gold branding to match the "noir.travel" identity.

## What Gets Built

### 1. Homepage CTA Component
**File:** `src/components/HomePage/NoirRideCTA.tsx`

- Same card structure as VacationRentalsCTA (animated reveal, two-column layout)
- Branding: Black/dark theme with gold accents, car/ride imagery
- Value props: "Safe Rides," "Support Black Drivers," "Door-to-Door"
- Two CTA buttons:
  - **"Request a Ride"** --> links to `/noir`
  - **"Become a Driver"** --> links to `/noir#drivers` (future)
- Lazy-loaded in HomePageSections.tsx like all other sections

### 2. Dedicated Landing Page
**File:** `src/pages/NoirLandingPage.tsx`
**Route:** `/noir`

- Premium landing page with luxury branding
- Hero section with noir.travel domain callout
- "How It Works" steps (pick destination, choose ride, go)
- Integration with directory: "Ride to any business in our directory"
- Deep-link buttons that open Uber/Lyft with the destination pre-filled (Phase 1 MVP)
- Featured businesses you can ride to (pulls from directory)
- Future driver signup section

### 3. Route Registration
- Add `/noir` route to the app router
- Add NoirLandingPage to lazy components registry

## Technical Details

- **NoirRideCTA.tsx** follows the exact same pattern as `VacationRentalsCTA.tsx` -- framer-motion scroll reveal, glassmorphic card, responsive grid layout
- **HomePageSections.tsx** gets a new lazy import and section entry between VacationRentalsCTA and ThreePillars
- **NoirLandingPage.tsx** is added to `LazyComponents.ts` for code-splitting
- Uber deep-link format: `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]={lat}&dropoff[longitude]={lng}&dropoff[nickname]={businessName}`
- The landing page will pull featured businesses from the existing directory data to show "popular destinations"

