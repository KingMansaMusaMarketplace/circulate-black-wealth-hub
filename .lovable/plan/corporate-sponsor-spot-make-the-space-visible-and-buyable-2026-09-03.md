# Corporate Sponsor Spot — make the space visible and buyable

Goal: give corporate sponsors an obvious, prestigious "spot" on the live site, and make the path from seeing that spot to paying as short as possible.

## The idea in plain English

Right now sponsor logos only appear once a sponsor already exists (footer grid). Nobody browsing the site can see that sponsorship is even for sale. The fix is to show the space itself — including the empty slots — the way a stadium shows an unsold naming rights sign.

## What gets built

1. **Sponsor Wall strip (public, reusable)**
   - A slim gold-bordered band: "Presented in partnership with" + sponsor logos.
   - Empty slots render as an elegant "Your brand here — Corporate Partnership" tile that links to `/corporate-sponsorship`.
   - Placed on: Home, Directory (below the search bar), and Business Detail pages. Footer keeps the existing grid.

2. **Dedicated `/sponsors` page (the "spot")**
   - Public hall-of-fame page: current partners by tier, each with logo, one-line description, and link to their site.
   - Open slots per tier shown with an "Available" tile and a Become a Sponsor button.
   - Impact numbers pulled live (verified businesses count, cities covered) so the page proves reach.

3. **Shorter path to payment**
   - On `/corporate-sponsorship`, each tier card gets a primary **Reserve this tier** button that goes straight to Stripe checkout (or a deposit/first-month invoice for the six-figure tiers), with "Talk to partnerships" as the secondary action. Today every card only scrolls to a form.
   - Founding Sponsor tier ($21,000 / $1,750 mo) gets self-serve checkout. Bronze and above route to a short qualification form then an invoice, since enterprise buyers rarely card-swipe $25k/mo.
   - Add scarcity framing that is true: number of slots remaining per tier, drawn from the sponsor table.

4. **Sponsor proof-of-value block**
   - Live counter of monthly directory impressions and AI-assistant referrals a sponsor logo would receive, so the price has a number behind it.

## Technical notes

- New `src/components/sponsors/SponsorWallStrip.tsx` reusing `useCachedSponsors`; open-slot count from a per-tier capacity map.
- New `src/pages/SponsorsPage.tsx` at route `/sponsors`, lazy-loaded like other public pages, with Helmet title/description for search.
- Tier capacity + "slots remaining" needs a small addition: a `sponsor_tier_capacity` table (tier, max_slots) with public read grant, or a hardcoded config map if you'd rather not touch the database. Default plan: config map first, table later.
- Checkout uses the existing Stripe setup and the `sponsor-pricing` / payment confirmation flow already in the project; no new provider.
- No changes to existing sponsor admin, CRM, or dashboards.

## Open decisions for you

- Should Founding Sponsor be self-serve checkout, or should every tier go through a call first?
- How many slots per tier do we advertise as available?
- Do you want the Sponsor Wall on the Home page above the fold, or below the directory preview?

## Board Check

- Scope: new public page, new public copy, new payment entry point.
- Risk: showing empty slots signals we have few sponsors. Mitigated by capping displayed slots (e.g. show 4 tiles max) and by leading with 1325.AI's own founding badge.
- No pricing changes proposed; existing tier prices are kept as-is.
