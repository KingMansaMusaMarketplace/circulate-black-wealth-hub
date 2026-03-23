

## Recommendation: Sticky Sponsor Sidebar on Directory Pages

**Why this wins for sponsors:** The directory page is where users spend the most time — browsing, searching, filtering. A sticky sidebar ad gives sponsors persistent, non-intrusive visibility during high-intent browsing sessions. Unlike the dismissible banner, it stays visible the entire session. Sponsors paying $3,500-$10,000/mo get measurable, sustained exposure where it matters most.

This is the approach used by Google, Yelp, and every major directory — because it works.

---

### What We'll Build

**A `SponsorSidebar` component** that displays a rotating sponsor card pinned to the right side of the directory page (desktop only). On mobile, it becomes a slim inline card between search results.

**Visual design:**
- Subtle "Sponsored" label at top
- Sponsor logo (large, prominent)
- Company name + tier badge (Gold/Platinum glow)
- "Visit Website" CTA button
- Click and impression tracking via existing Supabase RPCs
- Smooth fade transition between sponsors every 10 seconds
- Styled to match the dark theme with gold accents

**Placement:**
- Desktop: Sticky sidebar alongside the business grid/list (right column)
- Mobile: Inline card inserted after the 3rd business result

---

### Technical Plan

1. **Create `src/components/sponsors/SponsorSidebar.tsx`**
   - Uses `useFeaturedSponsors()` hook (already exists) for data
   - Auto-rotates sponsors with configurable interval
   - Tracks impressions via `increment_sponsor_impression` RPC
   - Tracks clicks via `increment_sponsor_click` RPC
   - Framer Motion animations for transitions
   - `sticky top-24` positioning on desktop
   - Responsive: hidden on mobile (separate inline variant)

2. **Create `src/components/sponsors/InlineSponsorCard.tsx`**
   - Compact horizontal card for mobile insertion between results
   - Same data source and tracking as sidebar

3. **Update `src/pages/DirectoryPage.tsx`**
   - Wrap the main content area in a flex layout: content (left) + sidebar (right)
   - Desktop: add `SponsorSidebar` in right column alongside business results
   - Only show for Gold+ tier sponsors (per the pricing model)

4. **Update `BusinessGridView.tsx`**
   - Accept optional `inlineSponsor` prop
   - Insert `InlineSponsorCard` after the 3rd business card on mobile

