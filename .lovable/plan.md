

## Consolidate the 4 Impact Pages (Homepage Untouched)

### Current state
Four impact-related pages exist:
| File | Route | Purpose |
|---|---|---|
| `ImpactPage.tsx` | `/impact` | "My Impact" — personal dashboard wrapped in dark gradient layout, uses `<ImpactDashboard />` |
| `CommunityImpactPage.tsx` | `/community-impact` | Wraps `CommunityImpactDashboard` (full hero + leaderboard + CTAs) inside `DashboardLayout` |
| `EconomicImpactPage.tsx` | `/economic-impact` | Wraps `EconomicImpactDashboard` inside `DashboardLayout` |
| `ShareImpactPage.tsx` | `/share-impact` | Social-share focused page |

These overlap heavily — all show the same wealth-circulation story, just sliced differently.

### Canonical choice
Keep **`ImpactPage.tsx`** at `/impact` as the single hub. It already has the strongest visual treatment (dark gradient mesh, animated orbs) matching the brand. Refactor it to render a tabbed interface combining all three dashboards.

### Plan

**1. Refactor `ImpactPage.tsx`** to hold three tabs (using existing `Tabs` component):
   - **My Impact** — current `<ImpactDashboard />` content
   - **Community** — `<CommunityImpactDashboard />` (extracted from `CommunityImpactPage`)
   - **Economic** — `<EconomicImpactDashboard />` (extracted from `EconomicImpactPage`)
   
   Default tab = "My Impact". Keep the existing dark gradient background and `SponsorshipVideoSection` footer.

**2. Update `App.tsx` routes** so all three legacy paths resolve to the same page:
   - `/impact` → `ImpactPage` (default tab: My Impact)
   - `/community-impact` → `ImpactPage` (default tab: Community)
   - `/economic-impact` → `ImpactPage` (default tab: Economic)
   - `/share-impact` → keep as-is OR redirect to `/impact` (it serves a distinct social-share purpose; will confirm below)
   
   Pass an optional `defaultTab` prop (or read from URL) so deep links land on the right tab.

**3. Delete redundant page files**:
   - `src/pages/CommunityImpactPage.tsx`
   - `src/pages/EconomicImpactPage.tsx`
   - (Keep dashboard *components* — they're reused inside the tabs)

**4. Clean up `LazyComponents.tsx`** — remove the now-unused lazy exports for the deleted pages.

### What will NOT be touched
- **Homepage impact section** (`HomePageSections.tsx`, `TrustStatStrip`, `MissionPreview`, any `<ImpactDashboard />` or counter widgets shown on `/`) — completely untouched.
- All underlying dashboard components (`ImpactDashboard`, `CommunityImpactDashboard`, `EconomicImpactDashboard`) — preserved intact, just rendered inside tabs.
- Any nav links that point to these routes — they'll keep working since URLs are preserved.

### Net result
- 4 routes → 1 unified page with 3 tabs (or 4 if we keep `/share-impact`)
- 2 page files deleted
- Homepage untouched
- All existing deep links continue to work

### Question on `/share-impact`
Should `ShareImpactPage` also fold into the tabs, or stay as its own focused share-flow page?

