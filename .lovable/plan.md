# Directory Overhaul — Built to Scale to 200,000 Listings

Answering the three issues Clarence raised: a broken appointment button, a directory that browses poorly at scale, and a phone-first experience.

## 1. Fix the Book Appointment button (confirmed bug)

The button is genuinely broken. Business pages use a friendly web address (`/business/afrotech-oakland-328540`), but the button passes that friendly name to the booking page, which only recognises the internal ID number — so it reports "Business Not Found."

Two changes:

- Pass the correct internal ID so the button always lands on a working page.
- Only show the button when the business actually offers appointments (has at least one active service). Today only 1 of 47,081 businesses has services set up, so this button will disappear almost everywhere until owners turn bookings on — which is exactly what Clarence asked for.

Businesses without services keep the quieter "Request an appointment" option inside their page tabs, so a visitor can still reach out.

## 2. Fix the jumble: 50 main categories

Today there are 18,995 different category labels, and 15,075 of them are used by exactly one business. That is the root of the mess — not the number of businesses.

- Introduce **50 main categories** (Food & Dining, Beauty & Barber, Health & Wellness, Home Services, Legal, Financial, Auto, Faith, Education, Retail & Fashion, Arts & Media, Tech, Nonprofit, Farms & Agriculture, and so on).
- Every existing label is mapped to one of the 50 by keyword. The exact type a business wrote ("Natural Hair Braiding Salon") still shows on the listing — we group, we don't erase.
- Anything unmatched goes to "Other Services" and shows up in an admin list so it can be assigned over time.
- Browsing starts with 50 tiles instead of a 19,000-row list.

## 3. Segmentation by place

- Add a **country** field. Today there is no way to tell US from international: 44,215 listings are US, 2,726 are outside the US (Canada, Caribbean, Africa, UK and others), and 140 have no location at all. We fill this in from existing state and address data.
- **Browse by place:** Country → State/Province → Region → City. For the US, states are grouped into regions (South, Midwest, Northeast, West) and each state page shows its major metro areas.
- **Combined browsing:** category and place work together — "Hair Salons in Georgia," "Restaurants in Atlanta." Every combination gets its own shareable web address, which also brings in search traffic.
- **International section:** countries and territories listed separately so they are findable rather than buried.
- Clean up the location data: 220 different state values today, many of them typos or full names instead of codes.

## 4. Phone-first layout

Most people browse on a phone, so the phone layout leads:

- Landing view is a search box plus 50 category tiles (two columns, thumb-reachable) and a "Near me" button — not a wall of listings.
- Location and category choices live in a bottom sheet you pull up, not a desktop sidebar squeezed onto a small screen.
- Listings scroll continuously on phones instead of "page 1 of 95," which is unusable with a thumb.
- Compact cards: name, category, city, distance, verified mark. Nothing else competes for space.
- Sticky breadcrumb at the top so you always know where you are and can back out one level.

## 5. Reply to Clarence

A short, professional reply for you to send: confirms the appointment button is fixed and now only appears where booking is real, lays out the 50-category and country/state/region/city structure, and states plainly that the phone layout leads. Delivered in chat, ready to paste.

## Technical notes

- `src/pages/BusinessDetailPage.tsx`: `navigate('/book/' + businessId)` passes the URL slug; change to `business.id` and render the button only when a `business_services` count for that business is greater than zero.
- New `src/data/categoryGroups.ts`: 50 groups with keyword rules; a `resolveCategoryGroup(raw)` helper used by the directory hook, category pills and the business card subtitle.
- Migration: add `country` (text, default 'US') and `category_group` (text) to `public.businesses`, backfill both, index `(country, state, category_group)` and `(category_group)`; extend `search_directory_businesses` RPC with `p_country`, `p_state`, `p_category_group` and keep the existing fallback query in `use-supabase-directory.ts` in sync.
- Routes: `/directory/:country?/:state?/:city?` and `?group=` for category, with canonical tags in `DirectoryStructuredData`.
- Mobile: `useIsMobile` branch in `DirectoryPage.tsx` renders a new `MobileDirectoryHome` (search + 50 tiles + near me), reuses `MobileFiltersSheet` for the bottom sheet, and swaps `DirectoryPagination` for infinite scroll via `VirtualizedBusinessGrid`.
- State-value cleanup runs as a one-time SQL normalisation (full names → two-letter codes, trim whitespace) plus a check on new inserts.
