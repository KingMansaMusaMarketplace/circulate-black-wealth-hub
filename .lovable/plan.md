# Plan: Drive Free Directory Sign-Ups

## Goal
Make the primary job of the site clear and easy: get visitors to **sign up for free and use the 1325.AI directory** to find, save, and support Black-owned businesses.

## Current Problems
- The homepage (`/`) is institutional/investor-facing. The main CTA is "Submit your Business for FREE," which is for businesses, not consumers.
- There is no visible "Sign up free" CTA on the homepage for shoppers.
- The directory can be browsed without signing up, but the moment a visitor tries to save a favorite or claim a discount, they hit a hard email/password + email-verification wall.
- `HomeSignupStrip.tsx` (the only directory signup prompt) links to `/about-1325#submit-business` instead of `/signup`.
- A consumer-friendly hero component with dual customer/business CTAs and directory search exists in the codebase but is not wired to any route.

## Approach: preview first, no changes to the live homepage

Nothing on your current homepage changes in this round. The new directory-first homepage gets built at a **separate preview address: `/home-preview`**. You open it, look at it, and only if you like it do we swap it in as the real homepage (a one-line change later).

The smaller fixes below (broken signup link, signup page cleanup) are safe and unrelated to the homepage look, so those get done now.

## Proposed Changes

### 1. New directory-first homepage — built at `/home-preview` for review
- Consumer-focused message: discover Black-owned businesses, get 5–30% discounts, earn loyalty points, free to join.
- Prominent **"Sign up free"** primary button and a secondary **"Browse directory"** button.
- Directory search bar in the hero so visitors can immediately search businesses by city/category.
- Business submission path kept, but visually secondary ("Own a business? List it free").
- The current homepage at `/` stays exactly as it is until you say go.


### 2. Fix the signup strip
- Update `HomeSignupStrip.tsx` so its "Sign up free" button points to `/signup` and is visible on mobile.
- Use copy that matches the consumer promise: "Join 10,000+ users saving money and supporting Black-owned businesses."

### 3. Lower the signup friction
- Add **Google and Apple OAuth** options on the signup page so visitors can join in one click.
- Keep email/password signup but shorten the password requirement copy and reduce visual clutter.
- Optionally test a **lightweight email-first signup** (email only, set password later) for the customer tab to reduce drop-off.

### 4. Clarify the signup chooser
- On `/signup`, lead with the customer path: **"I want to save and support"**.
- De-emphasize the business signup card so it doesn't compete with the main goal.
- Remove the "Founding 100 — Pro at $149/mo" banner from the consumer signup page; it belongs only on the business flow.

### 5. Improve the guest-to-signup handoff
- In `SignupPromptModal`, remind the visitor what they were about to do (e.g., "Save this business to your favorites" or "Claim your discount") and show the benefit of signing up.
- Keep the modal but add the social-login buttons inside it so users can convert without leaving the directory.

### 6. Add a simple conversion signal
- Track when a visitor clicks the "Sign up free" CTA and when they complete customer signup. Use existing analytics infrastructure (`AnalyticsContext` or `funnel_events`).
- Avoid adding a new analytics service; instrument the existing event pipeline if available.

## Technical Approach
- Create `src/pages/HomePreviewPage.tsx` and register a `/home-preview` route in `src/App.tsx`. `src/pages/HomePage.tsx` and the `/` route are left untouched.
- Build the new hero from the pattern in the currently unused `src/components/Hero.tsx`, with a directory search input.
- Update `src/components/directory/HomeSignupStrip.tsx` links (point to `/signup`) and responsive styling.
- Modify `src/components/auth/forms/EnhancedSignupForm.tsx` to lead with the customer tab and de-emphasize business signup.
- Remove the $149/mo Founding 100 banner from `src/pages/SignupPage.tsx` (it belongs on the business flow).
- Add OAuth buttons to `CustomerSignupTab.tsx` and `SignupPromptModal.tsx` using the existing Supabase client.
- Track CTA clicks with the existing `trackFunnelEvent` helper in `src/lib/analytics/funnel-tracker.ts`.

## Out of Scope
- No change to the live homepage at `/` in this round.
- No changes to business signup pricing or business submission flow.
- No changes to investor portal, AAMES, or corporate sponsor pages.
- No database schema changes.

## What you do after the build
1. Open `/home-preview` and review it.
2. If you like it, say "make it the homepage" and I swap the `/` route over in one small change.
3. If you don't, we iterate on the preview page — the live site is never affected.

## Open Questions
1. If you approve the new homepage later, should the current institutional page stay reachable at `/about-1325`?
2. Should social login (Google/Apple) be part of this round, or a follow-up?