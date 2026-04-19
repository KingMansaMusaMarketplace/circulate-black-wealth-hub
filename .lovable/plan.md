
## Redundant Pages Audit

I scanned all **170+ page files** in `src/pages/` and the routes in `src/App.tsx`. Here are the redundancies grouped by category. Most are leftovers from iteration — same purpose, different names.

### 1. Sponsor / Corporate Sponsorship (6 overlapping)
| File | Status |
|---|---|
| `SponsorshipPage.tsx` (36 lines) | Stub — likely redirect |
| `CorporateSponsorshipPage.tsx` (85 lines) | Marketing landing |
| `CorporateSponsorshipPricingPage.tsx` (641 lines) | **KEEP** — main pricing |
| `SponsorLandingPage.tsx` (186 lines) | Another landing |
| `SponsorDashboard.tsx` (269 lines) | Dashboard v1 |
| `SponsorDashboardPage.tsx` (249 lines) | Dashboard v2 |
| `CorporateDashboardPage.tsx` (212 lines) | Dashboard v3 |

**Recommend:** Keep `CorporateSponsorshipPricingPage` + ONE dashboard. Merge or delete the rest.

### 2. Admin Dashboards (3 overlapping)
- `AdminPage.tsx` (164) · `AdminDashboard.tsx` (381) · `AdminDashboardPage.tsx` (313) — both `/admin` and `/admin-dashboard` already point to `AdminDashboardPage`. **KEEP that one, delete the other two.**

### 3. Directory / Businesses (4 overlapping)
- `DirectoryPage.tsx` (520) ← **KEEP** (active route)
- `EnhancedDirectoryPage.tsx` (268) · `BusinessDirectoryPage.tsx` (227) · `BusinessesPage.tsx` (243) — unused variants

### 4. User Dashboard (3 overlapping)
- `UnifiedDashboard.tsx` (213) ← **KEEP** (`/dashboard` uses this)
- `DashboardPage.tsx` (362) · `UserDashboardPage.tsx` (481) — old versions

### 5. Auth / Login / Signup (4 overlapping)
- `LoginPage.tsx` ← KEEP · `SignupPage.tsx` ← KEEP
- `AuthPage.tsx` (434) — combined version, likely unused
- `CustomerSignupPage.tsx` (78) — redundant with SignupPage

### 6. Password Reset (3 overlapping)
- `PasswordResetRequestPage.tsx` ← KEEP (request flow)
- `ResetPassword.tsx` (7 lines — stub) · `ResetPasswordPage.tsx` (120) · `NewPasswordPage.tsx` (149) — pick ONE for setting new password

### 7. Profile (2 overlapping)
- `ProfilePage.tsx` (82) vs `UserProfilePage.tsx` (430) — keep `UserProfilePage`

### 8. Settings (2 overlapping)
- `SettingsPage.tsx` (140) vs `UserSettingsPage.tsx` (267) — keep `UserSettingsPage`

### 9. Business Detail (3 overlapping)
- `BusinessDetailPage.tsx` (652) ← **KEEP** (active)
- `BusinessPage.tsx` (172) · `BusinessProfilePage.tsx` (46 stub) — remove

### 10. Help / Support (4 overlapping)
- `HelpPage.tsx` (74) · `HelpCenterPage.tsx` (127) · `SupportPage.tsx` (322) · `FAQPage.tsx` (167) — consolidate into Support + FAQ

### 11. About (2 overlapping)
- `AboutPage.tsx` (95) ← KEEP · `AboutUsPage.tsx` (31 stub) — delete

### 12. Loyalty / Rewards (2 overlapping)
- `LoyaltyPage.tsx` and `RewardsPage.tsx` are mapped to **different routes** but represent the same feature. Consider merging.

### 13. Test Pages (12+ overlapping)
`AppTestPage`, `FullAppTest`, `FullAppTestPage`, `FullSystemTestPage`, `SystemTestPage`, `ComprehensiveTestPage`, `MobileReadinessTestPage`, `MobileTestPage`, `CapacitorTestPage`, `QRTestPage`, `ButtonTestPage`, `SignupTestPage`, `RegistrationTestPage`, `PaymentTestPage`, `StripeTestPage`, `HBCUTestPage`, `CommunityImpactTestPage`, `MasterAppleReviewTestPage`, `AppleComplianceTestPage`, `TestPage`, `TestingHub`, `UnifiedTestDashboard`

`UnifiedTestDashboard` already exists to consolidate these. **Delete the rest** (or move to `pages/_dev/`).

### 14. Other small duplicates
- `Index.tsx` — redirects to `/`, kept "for compatibility" but unused
- `KaylaAnnouncementPage` + `WhatKaylaDoesPage` + `KaylaOnboardingSequencePage` — overlapping Kayla content
- `EconomicImpactPage` + `CommunityImpactPage` + `ImpactPage` + `ShareImpactPage` — 4 impact pages
- `ReferralPage` + `ReferralDashboard`
- `MerchStorePage` + `ProductDetailPage` — already commented out as hidden

---

### Summary count
**~50 pages** are redundant or unused. Largest wins from cleanup:
1. Sponsor pages (5 deletions)
2. Test pages (~18 deletions → keep `UnifiedTestDashboard`)
3. Auth duplicates (3 deletions)
4. Dashboards (4 deletions across admin/user/sponsor)
5. Directory variants (3 deletions)

### Proposed cleanup approach
**Phase 1 — Safe deletions (no route changes):** Delete files NOT referenced in `App.tsx` routes (~30 files). Zero risk.

**Phase 2 — Consolidations (route updates):** Pick the canonical page per group, redirect old routes to it, delete duplicates.

**Phase 3 — Test page cleanup:** Move all dev/test pages under one `/dev/*` namespace gated behind admin or remove entirely from production.

Want me to proceed with **Phase 1 (safe deletions only)** first so we can verify nothing breaks before consolidating?
