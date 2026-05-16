# Noire Rideshare Pivot: Hotel & Airport Transport

Reposition Noire from a general rideshare into a **premium, scheduled-only Black-owned transport service for hotels and airports in Chicago**. Phase 1 driver vetting stays. Checkr stays deferred until first hotel partners sign.

## What changes (plain English)

### 1. Rebrand the landing page (`/noir`)
- New hero: "Premium Black-Owned Hotel & Airport Transport — Chicago"
- Subhead emphasizes: scheduled rides only, flight tracking, meet-and-greet, vetted Black drivers, corporate billing
- Replace generic "request a ride" with three clear paths:
  - **Book a Ride** (riders — airport or hotel pickup)
  - **Hotel & Corporate Partners** (B2B concierge portal signup)
  - **Drive with Noire** (existing driver apply flow, unchanged)
- Update homepage `NoirRideCTA` copy to match (no more "your ride / your driver / your community" — replace with airport/hotel positioning)

### 2. Replace ride-request flow with scheduled booking
- Remove on-demand "pick me up now" UI
- New booking form fields:
  - Trip type: **Airport pickup**, **Airport drop-off**, **Hotel pickup**, **Hotel drop-off**, **Hotel ↔ Hotel**
  - Pickup date + time (min 2 hours out)
  - Flight number (optional, enables tracking) — for airport trips
  - Hotel name (autocomplete from partner list, or free text) — for hotel trips
  - Passenger count + luggage count
  - Meet-and-greet add-on (checkbox, +$15)
  - Special instructions
- Confirmation screen shows estimated fare range, assigned driver (once matched), and contact info

### 3. New Hotel Partners section + concierge portal
- Public marketing page: `/noir/hotels` — pitch to hotel GMs and concierge desks (benefits, sample concierge dashboard screenshot, contact form)
- Hotel partner signup → creates a `hotel_partner` record (pending admin approval)
- Once approved, concierge gets a portal at `/noir/concierge` to:
  - Book rides on behalf of guests (guest name, room number, pickup details)
  - View today's bookings for their property
  - Quick-rebook frequent routes (hotel → ORD, hotel → MDW)
  - Monthly invoice instead of per-ride payment

### 4. Admin dashboard additions
- New tab in `NoireRideshareAdmin`: **Hotel Partners** (approve/reject pending hotels, view active partners, see booking volume per hotel)
- Booking list filterable by: airport vs hotel, partner hotel, scheduled date

### 5. Keep as-is
- Phase 1 driver vetting (license, insurance, vehicle photos, admin approval) — unchanged, already perfect for this niche
- `DriverDetailDrawer` and `DriverApplyPage` — unchanged
- Checkr integration — still deferred until first 2–3 signed hotel contracts

## Database changes (technical)

New tables:
- `noir_hotel_partners` — hotel_name, address, contact_name, contact_email, contact_phone, concierge_user_id, status (pending/active/suspended), billing_terms (per_ride/monthly_invoice), commission_rate
- `noir_concierge_users` — links a user account to a hotel_partner with role (concierge/manager)

Changes to `noir_bookings` (existing table):
- Add `trip_type` enum: airport_pickup, airport_dropoff, hotel_pickup, hotel_dropoff, hotel_to_hotel
- Add `flight_number`, `hotel_partner_id` (nullable FK), `booked_by_concierge_id` (nullable, for B2B bookings)
- Add `meet_and_greet` boolean, `luggage_count` int, `passenger_count` int
- Add `scheduled_for` timestamp (replaces on-demand `requested_at` for new bookings)

RLS: hotel concierges can only see bookings for their own hotel; admins see all.

## Files I'll create / edit

**New:**
- `src/pages/noir/HotelPartnersPage.tsx` — public B2B pitch + signup form
- `src/pages/noir/ConciergePortalPage.tsx` — authenticated concierge dashboard
- `src/pages/noir/BookRidePage.tsx` — new scheduled booking form (replaces request-a-ride)
- `src/components/admin/noir/HotelPartnersTab.tsx` — admin approval UI
- `src/lib/api/noir-hotel-partners-api.ts`
- `supabase/migrations/<timestamp>_noir_hotel_pivot.sql`

**Edited:**
- `src/pages/NoirLandingPage.tsx` — new hero, three CTAs, hotel/airport positioning
- `src/components/HomePage/NoirRideCTA.tsx` — copy update on main homepage
- `src/components/admin/NoireRideshareAdmin.tsx` — add Hotel Partners tab
- `src/App.tsx` — register new routes

## What I will NOT do in this phase

- Build the actual driver-matching / dispatch algorithm (manual admin assignment for now — fine at low volume)
- Build payment processing (Stripe for rider payments, monthly invoicing for hotels — defer to next phase once a partner is signed)
- Build flight-tracking integration (FlightAware API — defer; for now flight number is just stored for the driver to see)
- Build the concierge mobile app (web portal is enough for v1)
- Touch Checkr / background checks (still deferred per your decision)

## After this is built — your next steps

1. Walk into 3–5 Chicago boutique hotels (start with Black-owned ones — e.g. The Robey, Sable at Navy Pier) with the hotel partner pitch URL
2. Offer first hotel a free 30-day pilot (no commission) in exchange for a testimonial
3. Once one hotel is live, use that logo + quote on the marketing page to land the next two
4. **Then** we wire up Checkr and Stripe — by that point you'll have real revenue justifying the ~$25/check cost

Want me to proceed with this plan?
