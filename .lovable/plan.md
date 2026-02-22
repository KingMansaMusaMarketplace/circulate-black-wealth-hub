

# Noir Rebrand: Lead with Excellence

## Overview
Update the Noir homepage CTA and landing page to position Noir as a full-market ride-share competitor. Lead with quality, fairness, and the 80/20 driver split -- not race-specific language.

## Changes

### 1. Homepage CTA (`src/components/HomePage/NoirRideCTA.tsx`)

**Current** --> **New**
- Headline: "Premium Rides to **Black-Owned** Businesses" --> "Premium Rides. **Fair Prices.** Your Driver Keeps More."
- Description: "supporting Black drivers and Black businesses" --> "Lower fees for riders, higher pay for drivers. Noir takes just 20% -- your driver keeps the rest."
- Value props: Keep "Safe Rides" and "Door-to-Door", add "Drivers Keep 80%"

### 2. Landing Page (`src/pages/NoirLandingPage.tsx`)

**Hero Section**
- Current: "Premium rides to Black-owned businesses. Support the community with every trip."
- New: "The Ride-Share That Puts People First. Lower fares. Higher driver pay. Premium experience."

**How It Works Steps**
- Step 1: "Pick a Destination" --> "Enter Your Destination" / "Going anywhere? Enter an address or pick a spot from our directory."
- Step 2: "Choose Your Ride" --> "Get Matched" / "We connect you with a nearby Noir driver. No surge pricing games."
- Step 3: "Arrive & Support" --> "Ride and Save" / "Pay less than the big apps. Your driver takes home 80% of the fare."

**Featured Destinations**
- Header: "Ride to **Featured Businesses**" --> "**Popular Destinations**"
- Subtext stays functional (pick a destination, we open your ride app)

**Driver CTA**
- Current: "drivers serving the community. Fair pay..."
- New: "Keep 80% of every fare. No gimmicks. Noir drivers earn more because we take less -- just 20%."

## Technical Details

Only two files are modified -- no routing, schema, or structural changes:
- `src/components/HomePage/NoirRideCTA.tsx` -- copy updates to headline, description, and value props
- `src/pages/NoirLandingPage.tsx` -- copy updates to hero, steps array, section headers, and driver CTA text

