

### Plan: Remove `QuickHowItWorks` from the homepage

**File: `src/components/HomePage/HomePageSections.tsx`**

Remove two things:
1. The lazy import: `const QuickHowItWorks = lazy(() => import('./QuickHowItWorks'));`
2. The rendered section block (item "4. Quick How It Works") wrapping `<QuickHowItWorks />` in its `SectionErrorBoundary` + `LazySection`.

**Resulting homepage flow:**
1. Mission Preview
2. Agentic Protocol
3. Consumer Benefits
4. See The Impact (YouTube)
5. Featured Businesses ← (was #5, now flows directly after Impact)
6. CTA
7. Three Pillars (the canonical 3-card explainer)
8. Meet Kayla
9. Pricing
10. Vacation Rentals / Noir Ride / Circulation Gap

The component file `QuickHowItWorks.tsx` itself will be left in place (unused) so it can be revived later if needed without restoring code from history.

### Out of scope
- No edits to `QuickHowItWorks.tsx`.
- No reordering of remaining sections.
- No copy changes to `ThreePillars` (it now carries the explainer role solo).

