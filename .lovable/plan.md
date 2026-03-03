

# Full Deep Detail Test Plan -- Frontend and Backend

This plan covers a comprehensive end-to-end testing strategy for the entire 1325.AI / Mansa Musa Marketplace platform, covering 250 database tables, 100+ edge functions, and the full React frontend.

---

## Phase 1: Automated Unit and Integration Tests (Vitest)

Expand the existing test suite (currently 7 test files) with new tests covering critical untested areas:

### 1.1 Auth Flow Tests (expand `src/test/auth.test.tsx`)
- Sign-up with all user types (customer, business, sales agent)
- Rate-limit enforcement (`check_auth_rate_limit_secure` RPC)
- Session persistence and refresh
- Password reset flow
- Protected route redirect behavior

### 1.2 Business Directory Tests (new `src/test/directory.test.tsx`)
- Search and filter logic
- Category and location filtering
- Real-time updates subscription
- Pagination and the 1000-row query limit

### 1.3 QR Code and Loyalty Tests (expand `src/test/qr-code.test.tsx`)
- QR generation and scanning flow
- Loyalty point earning and redemption
- Coalition points cross-business earning
- Leaderboard ranking calculation

### 1.4 Voice Interface Tests (new `src/test/voice.test.tsx`)
- VoiceButton state transitions (idle, listening, speaking, tool-executing)
- VoiceWaveform animation states
- VoiceTranscript bubble rendering

### 1.5 Subscription and Payment Tests (expand `src/test/checkout.test.tsx`)
- Corporate checkout session creation
- Stripe webhook event handling logic
- iOS payment blocking (`IOSProtectedRoute`)
- Subscription status checking

---

## Phase 2: Backend Database Health Checks

### 2.1 Table Integrity
- Verify all 250 public tables are accessible
- Check for orphaned foreign key references
- Validate critical table row counts (profiles, businesses, qr_codes, loyalty_points)

### 2.2 RLS Policy Audit
- Fix the SECURITY DEFINER view issue flagged by linter (public views like `partner_leaderboard`, `business_directory`)
- Review the "RLS Policy Always True" warning -- identify which tables have overly permissive UPDATE/DELETE/INSERT policies
- Ensure all sensitive tables (profiles, transactions, fraud_alerts, etc.) have proper user-scoped RLS

### 2.3 Database Functions
- Test `has_role` security definer function
- Test `check_auth_rate_limit_secure` RPC
- Validate audit logging triggers

---

## Phase 3: Edge Function Testing

### 3.1 Critical Edge Functions (JWT-required)
Test via `curl_edge_functions` tool:
- `ai-assistant` -- responds to authenticated requests
- `create-payment-intent` -- validates parameters
- `create-booking` -- validates booking data
- `delete-account` -- requires authenticated user
- `detect-fraud` -- processes fraud checks
- `process-qr-transaction` -- handles QR scans

### 3.2 Public Edge Functions
- `generate-sitemap` -- returns valid sitemap XML
- `api-gateway` -- validates API key extraction and rate limiting
- `track-invitation` -- validates token and redirect allowlist

### 3.3 Webhook Endpoints
- `stripe-webhook` -- signature validation
- `stripe-webhook-corporate` -- subscription lifecycle events
- `stripe-partner-webhook` -- referral credit automation

---

## Phase 4: Frontend Component and Page Tests

### 4.1 Critical Page Rendering
Browser-based verification that key pages render without errors:
- `/` (Homepage with Hero, directory, voice interface)
- `/auth` (Login/Signup)
- `/directory` (Business directory with search)
- `/loyalty` (Loyalty dashboard)
- `/qr-scanner` (QR code scanner)
- `/dashboard` (User dashboard)
- `/admin` (Admin dashboard -- requires admin role)

### 4.2 Mobile Responsiveness
- Test at 375x812 (iPhone) and 768x1024 (iPad) viewports
- Verify touch targets, navigation, and layout

### 4.3 Performance Metrics
- Bundle size check
- First Contentful Paint target (under 3s)
- Core Web Vitals from existing `PerformanceMonitor`

---

## Phase 5: Security Scan

### 5.1 Automated Security
- Run the full security scan tool
- Address all ERROR-level findings
- Review and document WARN-level findings

### 5.2 Known Issues to Address
- `gl-matrix` TypeScript build errors (pre-existing, unrelated to app code -- fix by adding `skipLibCheck: true` to tsconfig)
- `cdn.tailwindcss.com` usage in production warning
- Global error handler capturing undefined errors on page load

---

## Technical Implementation Details

### New test files to create:
1. `src/test/directory.test.tsx` -- Business directory search/filter tests
2. `src/test/voice.test.tsx` -- Voice interface component tests  
3. `src/test/security.test.tsx` -- RLS and auth guard tests
4. `src/test/edge-functions.test.ts` -- Edge function response validation

### Existing files to expand:
1. `src/test/auth.test.tsx` -- Add rate limiting and multi-user-type tests
2. `src/test/checkout.test.tsx` -- Add corporate and webhook tests
3. `src/test/qr-code.test.tsx` -- Add coalition and leaderboard tests

### Configuration fixes:
1. `tsconfig.app.json` -- Add `skipLibCheck: true` to resolve gl-matrix errors
2. Remove or replace `cdn.tailwindcss.com` script tag (already using PostCSS Tailwind)

### Database fixes:
1. Convert SECURITY DEFINER views to INVOKER or add proper security constraints
2. Tighten overly permissive RLS policies on write operations

---

## Estimated Scope
- ~15 new/expanded test files
- ~200+ individual test cases
- 6 edge function smoke tests
- 7 critical page rendering verifications
- 3 security/database fixes

