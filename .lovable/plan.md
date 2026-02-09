
# Codebase Improvements Plan

This plan addresses three key areas for improvement: **Feature Flags System**, **Test Coverage**, and **Code Consolidation**.

---

## Overview

The improvements will be implemented in three phases:

1. **Feature Flags Enhancement** - Add a React hook and context for runtime feature flag checks
2. **Test Coverage Expansion** - Add unit tests for critical paths (auth, payments, loyalty)
3. **Code Consolidation** - Merge redundant admin pages and test pages

---

## Phase 1: Feature Flags System Enhancement

### Current State
- FeatureFlagsManager component exists for admin UI management
- Database table `feature_flags` stores flags
- Basic `app-config.ts` has hardcoded feature flags

### Improvements

**1.1 Create a Feature Flags Hook (`useFeatureFlags`)**
- New file: `src/hooks/use-feature-flags.ts`
- Provides `isEnabled(flagKey)` function
- Handles rollout percentage logic
- Checks user type targeting
- Caches results using TanStack Query

**1.2 Create Feature Flags Context**
- New file: `src/contexts/FeatureFlagsContext.tsx`
- Pre-loads all flags on app startup
- Provides sync access to flag states
- Handles real-time flag updates

**1.3 Create Feature Gate Component**
- New file: `src/components/feature-flags/FeatureGate.tsx`
- Conditional rendering wrapper
- Shows children only if flag is enabled
- Optional fallback component support

### Usage Example
```tsx
// Using the hook
const { isEnabled } = useFeatureFlags();
if (isEnabled('new_checkout_flow')) {
  // Show new checkout
}

// Using the gate component
<FeatureGate flag="beta_dashboard" fallback={<OldDashboard />}>
  <NewDashboard />
</FeatureGate>
```

---

## Phase 2: Comprehensive Test Coverage

### Current State
- 4 test files exist: `auth.test.tsx`, `checkout.test.tsx`, `directory-performance.test.tsx`, `setup.ts`
- Tests are mostly validation logic, not component rendering
- Missing tests for loyalty system and QR scanning

### New Test Files to Create

**2.1 Loyalty System Tests**
- File: `src/test/loyalty.test.tsx`
- Tests for:
  - Points calculation and tier determination
  - Points history aggregation
  - Reward redemption logic
  - Edge cases (zero points, tier boundaries)

**2.2 QR Code Tests**
- File: `src/test/qr-code.test.tsx`
- Tests for:
  - UUID validation for QR codes
  - Scan limit enforcement logic
  - Points awarding calculations
  - Inactive QR code handling

**2.3 Feature Flags Tests**
- File: `src/test/feature-flags.test.tsx`
- Tests for:
  - Rollout percentage calculations
  - User type targeting
  - Flag enable/disable states

**2.4 Payment/Commission Tests**
- File: `src/test/payment-commission.test.tsx`
- Tests for:
  - Commission rate calculations (7.5%)
  - Business payout calculations
  - Proration logic

### Test File Structure
```text
src/test/
├── setup.ts              (exists)
├── auth.test.tsx         (exists)
├── checkout.test.tsx     (exists)
├── directory-performance.test.tsx (exists)
├── loyalty.test.tsx      (NEW)
├── qr-code.test.tsx      (NEW)
├── feature-flags.test.tsx (NEW)
└── payment-commission.test.tsx (NEW)
```

---

## Phase 3: Code Consolidation

### 3.1 Admin Pages Consolidation

**Current State** - Three similar admin pages:
| Page | Route | Purpose |
|------|-------|---------|
| AdminPage.tsx | /admin | Database setup wizard |
| AdminDashboard.tsx | /admin-dashboard (accessible from AdminDashboardPage) | Tabbed dashboard with overview |
| AdminDashboardPage.tsx | /admin-dashboard | Full sidebar dashboard |

**Consolidation Strategy:**
- Keep `AdminDashboardPage.tsx` as the primary admin interface (most feature-complete)
- Integrate database setup from `AdminPage.tsx` into AdminDashboardPage as a "Setup" tab
- Deprecate `AdminDashboard.tsx` (redirect to AdminDashboardPage)
- Update routes to point `/admin` to the consolidated page

**Implementation:**
1. Add "Setup" section to AdminSidebar navigation
2. Move DatabaseSetup and SupabaseSetup components into AdminDashboardPage
3. Update App.tsx routes:
   - `/admin` redirects to `/admin-dashboard`
   - Remove AdminDashboard.tsx import
4. Mark deprecated files with comments

### 3.2 Test Pages Consolidation

**Current Test Pages** (12+ pages):
- SystemTestPage, MobileTestPage, ComprehensiveTestPage
- SignupTestPage, QRTestPage, PaymentTestPage
- CapacitorTestPage, AppleComplianceTestPage
- HBCUTestPage, RegistrationTestPage
- UnifiedTestDashboard, TestingHub, TestPage

**Consolidation Strategy:**
- Enhance `UnifiedTestDashboard.tsx` to be the single entry point
- Add tabs/sections for all test categories
- Keep specialized test components but integrate them into the unified view
- Update TestingHub to link directly to UnifiedTestDashboard sections

**New UnifiedTestDashboard Structure:**
```text
Tabs:
├── System Tests (from SystemTestPage, FullSystemTest)
├── Mobile Tests (from MobileTestPage, CapacitorTestPage)
├── Auth Tests (from SignupTestPage, RegistrationTestPage)
├── Feature Tests (from QRTestPage, PaymentTestPage)
├── Compliance (from AppleComplianceTestPage)
└── All Test Links (directory of all test pages)
```

---

## Technical Details

### New Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/use-feature-flags.ts` | Hook for checking feature flags |
| `src/contexts/FeatureFlagsContext.tsx` | Context provider for flags |
| `src/components/feature-flags/FeatureGate.tsx` | Conditional render wrapper |
| `src/test/loyalty.test.tsx` | Loyalty system unit tests |
| `src/test/qr-code.test.tsx` | QR code logic tests |
| `src/test/feature-flags.test.tsx` | Feature flags tests |
| `src/test/payment-commission.test.tsx` | Payment calculation tests |

### Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Update admin routes, clean up test page routes |
| `src/pages/AdminDashboardPage.tsx` | Add Setup tab |
| `src/components/admin/AdminSidebar.tsx` | Add Setup navigation |
| `src/pages/UnifiedTestDashboard.tsx` | Add more test categories |

### Files to Deprecate (soft delete)

| File | Reason |
|------|--------|
| `src/pages/AdminPage.tsx` | Merged into AdminDashboardPage |
| `src/pages/AdminDashboard.tsx` | Duplicate of AdminDashboardPage |

---

## Implementation Priority

1. **Feature Flags Hook & Context** - Enables safer rollouts immediately
2. **New Test Files** - Increases code reliability
3. **Admin Consolidation** - Simplifies navigation
4. **Test Page Consolidation** - Developer experience improvement

---

## Expected Outcomes

- Single source of truth for feature flags with runtime checking
- Test coverage for 4 critical paths (auth, loyalty, QR, payments)
- Simplified admin experience with one dashboard
- Unified testing interface for developers
- Reduced code duplication and maintenance burden
