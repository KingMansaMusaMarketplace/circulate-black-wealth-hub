
# Mansa Stays: Black-Owned Vacation Rental Marketplace

## Vision
Create the **first Black-owned vacation rental platform** - a direct competitor to Airbnb, VRBO, and Evolve. Hosts can list properties, guests can book stays with date ranges, and the platform captures **7.5% commission** on every transaction - all integrated into the existing 1325.AI ecosystem.

---

## What We're Building

**For Guests:**
- Browse vacation rentals by location, dates, price, amenities
- Date-range booking (check-in / check-out)
- Guest count and pet-friendly filters
- Secure payment through existing Stripe Connect
- Booking history and upcoming stays

**For Hosts (Property Owners):**
- Property listing with photos, descriptions, house rules
- Availability calendar management
- Nightly pricing with seasonal adjustments
- Guest communication and booking management
- Earnings dashboard with commission tracking

---

## Existing Infrastructure We'll Leverage

| Component | Status | Reuse Strategy |
|-----------|--------|----------------|
| Stripe Connect (7.5% fee) | Ready | Direct integration for host payouts |
| Mapbox Discovery | Ready | Property location display |
| User Authentication | Ready | Guest/Host login |
| Business Availability Hook | Adapt | Convert from hourly to nightly slots |
| Booking Form Components | Adapt | Extend for date-range selection |
| Business Directory | Extend | Add "Vacation Rentals" category view |

---

## Database Schema

### New Tables

**1. `vacation_properties`** - Core property listings
```text
- id, host_id (references auth.users)
- title, description, property_type (house, apartment, cabin, villa)
- address, city, state, zip_code, country
- latitude, longitude (for Mapbox)
- bedrooms, bathrooms, max_guests
- base_nightly_rate, cleaning_fee, service_fee
- amenities (JSONB array: wifi, pool, kitchen, etc.)
- house_rules (text)
- photos (JSONB array of URLs)
- is_active, is_instant_book
- min_nights, max_nights
- check_in_time, check_out_time
- created_at, updated_at
```

**2. `property_availability`** - Blocked dates & pricing overrides
```text
- id, property_id
- date (single date)
- is_available (boolean)
- custom_price (optional nightly rate override)
- booking_id (if blocked by a booking)
```

**3. `vacation_bookings`** - Guest reservations
```text
- id, property_id, guest_id
- check_in_date, check_out_date
- num_guests, num_nights
- nightly_rate, cleaning_fee
- subtotal, platform_fee (7.5%), host_payout
- status (pending, confirmed, completed, cancelled)
- payment_intent_id, stripe_charge_id
- guest_name, guest_email, guest_phone
- special_requests
- created_at, updated_at
```

**4. `property_reviews`** - Guest reviews
```text
- id, property_id, booking_id, guest_id
- rating (1-5), cleanliness, accuracy, communication, location, value
- review_text
- host_response
- created_at
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
1. Database tables + RLS policies
2. Add "Vacation Rentals" as primary category
3. Create property listing form for hosts
4. Basic property detail page

### Phase 2: Booking System (Week 2)
1. Date-range picker component (check-in/out)
2. Availability calendar for properties
3. Pricing calculator (nights × rate + fees)
4. Booking creation edge function with Stripe Connect

### Phase 3: Discovery (Week 3)
1. Vacation rentals directory page with filters
2. Map view of properties
3. Search by location, dates, guests, amenities
4. Featured properties section

### Phase 4: Host Dashboard (Week 4)
1. Property management dashboard
2. Booking calendar and reservations
3. Earnings and payout tracking
4. Guest communication tools

---

## New Components to Create

```text
src/
├── pages/
│   ├── VacationRentalsPage.tsx        # Directory of rentals
│   ├── PropertyDetailPage.tsx         # Single property view
│   ├── PropertyListingPage.tsx        # Host: Add/edit property
│   ├── HostDashboardPage.tsx          # Host management
│   └── GuestTripsPage.tsx             # Guest: My bookings
│
├── components/
│   └── vacation-rentals/
│       ├── PropertyCard.tsx           # Grid display card
│       ├── PropertyGallery.tsx        # Photo gallery
│       ├── DateRangePicker.tsx        # Check-in/out selector
│       ├── GuestCounter.tsx           # Adults/children/pets
│       ├── AmenitiesList.tsx          # Amenity icons
│       ├── PricingBreakdown.tsx       # Nightly rate + fees
│       ├── AvailabilityCalendar.tsx   # Host calendar management
│       ├── PropertyBookingWidget.tsx  # Booking sidebar
│       └── PropertyFilters.tsx        # Search filters
│
├── hooks/
│   ├── usePropertyAvailability.ts     # Date-range availability
│   └── useVacationBooking.ts          # Booking logic
│
└── lib/services/
    └── vacation-rental-service.ts     # API layer

supabase/functions/
├── create-vacation-booking/           # Payment + booking
└── manage-property-availability/      # Host calendar
```

---

## Payment Flow (7.5% Commission)

```text
Guest pays $500 total
     │
     ▼
┌─────────────────────────────────────┐
│  $37.50 → Platform Commission       │
│  $462.50 → Host Stripe Account      │
└─────────────────────────────────────┘
     │
     ▼
Stripe Connect Express transfers to host
```

---

## Competitive Positioning

| Feature | Airbnb | VRBO | Evolve | Mansa Stays |
|---------|--------|------|--------|-------------|
| Black-Owned Focus | No | No | No | **Yes** |
| Platform Fee | 14-20% | 8-15% | 10% | **7.5%** |
| Community Investment | No | No | No | **Susu Circles** |
| Loyalty Rewards | No | No | No | **Economic Karma** |
| Business Directory | No | No | No | **Integrated** |

---

## Technical Notes

- **Date-range booking**: Replaces the current time-slot system with check-in/check-out dates
- **Availability calendar**: Uses a date-based blocking system instead of hourly slots
- **Pricing**: Nightly base rate + cleaning fee + service fee (calculated dynamically)
- **Photos**: Stored in Supabase Storage with CDN delivery
- **Host verification**: Integrates with existing business verification system
- **RLS Policies**: Hosts can only manage their properties; guests can only view active listings

---

## Revenue Projection

With the existing user base and 155 businesses, if even 10% of users list properties:

- 15 properties × avg $150/night × 50% occupancy
- = $34,125/month in bookings
- = **$2,559/month platform revenue** (7.5%)

As the platform scales, this becomes a significant recurring revenue stream.

---

## Summary

This feature positions 1325.AI as the **first Black-owned alternative** to Airbnb/VRBO/Evolve - a powerful differentiator that fills a genuine market gap. The technical foundation is 80% complete; we're extending existing patterns rather than building from scratch.

Dr. Atwater's insight is spot-on: there's no Black-owned vacation rental platform at scale. This could be a flagship feature that drives significant community wealth circulation.
