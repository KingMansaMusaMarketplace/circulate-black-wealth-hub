

## Onboarding Clarity Improvement Plan

### Problem
The app has **4 separate onboarding systems** (WelcomeFlow, OnboardingFlow, BusinessOnboardingFlow, OnboardingTour) that are text-heavy, redundant, and overwhelming. A first-time visitor sees walls of bullet points instead of a clear path to value.

### What Changes

**1. Redesign WelcomeFlow as a 3-step visual wizard (not 4 text-heavy slides)**

Replace the current 4-step walls-of-text with 3 concise, visually-driven steps:
- **Step 1 — "Welcome"**: Animated hero with the value prop in one sentence + user type selector (Customer / Business Owner)
- **Step 2 — "Here's how it works"**: 3 icon cards showing the core loop (Discover → Scan → Earn for customers; Profile → QR Codes → Grow for business)
- **Step 3 — "Your first action"**: Single primary CTA button that routes to the most valuable first action (Directory for customers, Profile setup for business)

Each step: max 2 sentences of copy, large icons/illustrations, smooth slide transitions.

**2. Replace the OnboardingTour with contextual tooltips**

Instead of a sequential spotlight tour that fires on the homepage (where most targets don't exist), show **single contextual tooltips** when users first visit specific pages:
- Directory page: "Search or filter to find businesses near you"
- Scanner page: "Point your camera at a business QR code to earn points"
- Dashboard: "Track your impact and loyalty points here"

These appear once per page (localStorage flag), dismiss on click, and don't block interaction.

**3. Consolidate and remove redundancy**

- Remove `OnboardingFlow.tsx`, `BusinessOnboardingFlow.tsx`, `SalesAgentOnboardingFlow.tsx`, `CorporateOnboardingFlow.tsx` — all duplicates of WelcomeFlow logic
- Remove `useOnboarding.ts` (the one in components/onboarding) and the Supabase `user_onboarding` table dependency — use localStorage like WelcomeFlow already does
- Keep `OnboardingTour.tsx` component but repurpose it for single-tooltip usage
- Remove `WelcomeGuide.tsx` dashboard card (replaced by contextual tooltips)

**4. Add progress persistence**

Store onboarding completion per user ID in localStorage (already partially done) so returning users on new devices still skip it. The Supabase `user_onboarding` table remains as a backup for cross-device sync.

### Files Modified
- `src/components/onboarding/WelcomeFlow.tsx` — full redesign (3 steps, visual, concise)
- `src/hooks/useOnboardingFlow.ts` — simplify trigger logic
- `src/components/onboarding/OnboardingTour.tsx` — refactor to single-tooltip mode
- `src/hooks/useOnboardingTour.ts` — simplify to page-level contextual tips
- `src/components/layout/MainLayout.tsx` — no changes needed (already renders WelcomeFlow)
- `src/pages/HomePage.tsx` — remove OnboardingTour rendering
- Add contextual tooltip triggers to Directory, Scanner, and Dashboard pages

### Files Removed
- `src/components/onboarding/OnboardingFlow.tsx`
- `src/components/onboarding/BusinessOnboardingFlow.tsx`
- `src/components/onboarding/SalesAgentOnboardingFlow.tsx`
- `src/components/onboarding/CorporateOnboardingFlow.tsx`
- `src/components/onboarding/BusinessFeaturesTour.tsx`
- `src/components/onboarding/OnboardingStep.tsx`
- `src/components/dashboard/WelcomeGuide.tsx`
- `src/components/onboarding/tours/customerTour.ts`
- `src/components/onboarding/tours/businessOwnerTour.ts`
- `src/components/onboarding/tours/salesAgentTour.ts`
- Related unused hooks (`useBusinessOnboarding`, `useSalesAgentOnboarding`, `useCorporateOnboarding`)

### Result
- First-time onboarding drops from ~16 screens of text to **3 visual steps** taking under 30 seconds
- Contextual help appears where and when users need it, not all at once
- Codebase loses ~15 redundant files

