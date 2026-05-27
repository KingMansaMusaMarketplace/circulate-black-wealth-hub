# Plan: Fix Items 1, 2, 3 from Manus.ai Audit

## Item 1 — Sync business counts to "43,000+"

Replace every hardcoded "36,000+" and "50,000+" with **"43,000+"** across:

- `index.html` — `<title>`, meta description, OG tags, Twitter tags, JSON-LD blocks, noscript body
- `src/utils/seoUtils.ts` — home, directory, about, signup page SEO
- `src/components/Hero.tsx` — hero subtitle
- `src/pages/DirectoryPage.tsx` — header count line
- `src/pages/BusinessSignupPage.tsx` — meta + the "50,000+" stat card
- `src/pages/InstitutionalAPIPage.tsx` — body copy
- `src/components/SEO/WebsiteStructuredData.tsx` + `OrganizationStructuredData.tsx`
- `src/components/AboutPage/InteractiveVisionTimeline.tsx`
- `src/pages/developers/ShowcaseGalleryPage.tsx`
- `public/llms.txt`

Leaving the live "43,964+" counter on the directory page alone — it pulls the real DB number and is accurate.

## Item 2 — Fix Restaurants (and other popular-category chips) returning empty

**Root cause:** chips send the label `"Restaurants"` (plural, group name) but the DB stores `"Restaurant"`, `"Soul Food Restaurant"`, `"Caribbean Restaurant"`, etc. The filter does a literal equality match → zero results.

**Fix:**
1. In `src/lib/api/directory/fetch-businesses.ts`, when the incoming `category` filter matches a **group key** in `src/lib/seo/category-groups.ts`, expand it to the group's list of DB categories and filter with `.in('category', [...])` instead of `.eq('category', ...)`.
2. Apply the same expansion in the non-authenticated `business_directory` query path.
3. Apply to the `useCachedBusinesses` hook too so cached lookups stay consistent.

Verification: after the fix, clicking "Restaurants" from the home page popular categories should land on `/directory?category=Restaurants` and immediately show thousands of results.

## Item 3 — Fix empty states (Stays + Blog)

**Mansa Stays** (`src/pages/stays/LeaseSearchPage.tsx` and any landing page showing "0+ Properties"):
- Add a prominent **"Beta — Launching Soon"** banner at the top (gold accent line, navy card, matches brand)
- Replace the "0 properties found" empty result with a friendly "We're onboarding hosts now — join the beta waitlist" card with the existing CTA
- Keep navigation working; no routes removed

**Blog** (`src/pages/BlogPage.tsx`):
- Hide the placeholder grid
- Show a single centered "Articles coming soon — subscribe for the first issue" card with an email signup (or link to existing newsletter form if present)
- Keep the route live so external links don't 404
- Leave the footer link in place (it lands on the Coming Soon card, not a list of empty placeholders)

## What I'm NOT changing in this pass

- Skeleton loaders (item 4 from Manus)
- OG image self-hosting (item 6)
- Contrast / mobile Kayla overlay (item 5)
- Directory back-button behavior

These are on the deferred list and can be a follow-up task.

## Verification after build

1. View `/` → hero says "43,000+"
2. Click "Restaurants" chip → see thousands of restaurants
3. View `/stays` → "Beta — Launching Soon" banner visible
4. View `/blog` → single "Coming Soon" card, no broken placeholders

---

**Reply "go" to approve and I'll implement all three in one pass.**
