

## Clean Up the 3 Kayla Pages

### Current state
| File | Route | Purpose | Linked from nav? |
|---|---|---|---|
| `AIAssistantPage.tsx` | `/ai-assistant` | **Live Kayla chat** (the actual product) | ✅ Yes — navbar, mobile menu, FAB, command palette |
| `KaylaAnnouncementPage.tsx` | `/kayla-announcement` | GTM copy: founder email + LinkedIn post (tabs) | ❌ No |
| `KaylaOnboardingSequencePage.tsx` | `/kayla-onboarding-sequence` | GTM copy: Day 0 / Day 3 / Day 7 email drip (tabs) | ❌ No |
| `WhatKaylaDoesPage.tsx` (602 lines) | `/what-kayla-does` | Marketing page listing 28 AI employees with savings | ❌ No |

### Analysis
- `AIAssistantPage` is **not redundant** — it's the actual Kayla product surface.
- The other three are all **GTM/marketing artifacts** with no nav entry points. `KaylaAnnouncement` and `KaylaOnboardingSequence` are essentially copy-paste reference pages (email templates) — these belong in a single internal "GTM Kit" page, not three separate routes.
- `WhatKaylaDoesPage` is a substantial 602-line marketing/sales page that *could* be valuable but is currently orphaned (nothing links to it).

### Plan

**1. Merge the 2 email-copy pages into one `KaylaGTMKitPage.tsx`**
   - Combine `KaylaAnnouncementPage` (announcement email + LinkedIn) and `KaylaOnboardingSequencePage` (drip emails) into a single tabbed page.
   - New tab structure: `Announcement | LinkedIn | Day 0 | Day 3 | Day 7`
   - Mount at `/kayla-gtm-kit`. Keep `/kayla-announcement` and `/kayla-onboarding-sequence` as redirects to the new route (so any external/founder links still work).

**2. Keep `WhatKaylaDoesPage.tsx` as-is**
   - It's a real marketing page worth preserving. Add a link to it from the `MeetKaylaSection` on the homepage so it's actually reachable (small follow-up improvement).
   - Route stays `/what-kayla-does`.

**3. Leave `AIAssistantPage.tsx` untouched** — it's the product.

**4. Cleanup**
   - Delete `KaylaAnnouncementPage.tsx` and `KaylaOnboardingSequencePage.tsx`.
   - Update `App.tsx` (web + native route blocks) and `LazyComponents.tsx` to reference the new page.

### Net result
- 3 GTM/Kayla routes → 1 consolidated GTM kit page (+ 2 redirects)
- 2 page files deleted, 1 created
- `AIAssistantPage` and `WhatKaylaDoesPage` preserved
- All existing links continue to work

