## Goal
Add a prominent, gold-bordered video banner on `/how-it-works` that shows a **60–90 second walkthrough of the 3-step customer flow** (Sign Up → Discover → Scan & Save). It will sit right above the existing "How It Works" step list so first-time visitors see it before scrolling.

## Where it goes
On `src/pages/HowItWorksPage.tsx`, between the `HeroSection` + `PageNavigation` and the `HowItWorksSteps` section.

This is intentionally **separate** from the existing `StepVideo` component (which already holds two YouTube videos lower on the page). The new banner is the *primary* customer explainer — short, focused, above the fold-ish.

## What you'll see
A full-width banner styled to match the Mansa Stays gold-banner pattern you liked:

- **Left side (text):**
  - Small gold label: "New Customer? Start Here"
  - Headline: "How to Save at a Black-Owned Business — in 3 Steps"
  - One-sentence description: "Sign up, find a business near you, and scan the QR code at checkout to get an instant discount and earn loyalty points."
  - Three slim inline badges: `1. Sign Up`, `2. Discover`, `3. Scan & Save`
  - Two buttons: **Browse the Directory** (`/directory`) and **Sign Up Free** (`/signup`)
- **Right side (video):**
  - HTML5 `<video>` tag with `controls`, `preload="metadata"`, `playsInline`
  - Source: `/videos/1325AI-CustomerFlow-3Steps.mp4` (you'll upload this)
  - Gold border, rounded card, aspect-video, same shadow/styling as the Mansa Stays banners
  - Caption underneath: "▶ 3 Steps to Save & Earn — 90 sec walkthrough"

On mobile, the video stacks under the text.

## Files

1. **New component:** `src/components/HowItWorks/CustomerFlowVideoBanner.tsx`
   - Self-contained banner, copies the gold-gradient styling from the Mansa Stays banner on `VacationRentalsPage.tsx`
2. **Edit:** `src/pages/HowItWorksPage.tsx`
   - Import `CustomerFlowVideoBanner` and render it between `<PageNavigation />` and the `interactive-demo` section
3. **Add nav anchor (optional):** add `{ id: 'customer-flow', label: 'Start Here' }` at the top of the `navSections` array so the in-page nav links to it
4. **Video file:** I'll create the destination folder `public/videos/` and add a tiny placeholder `.mp4` so the `<video>` tag doesn't 404. You'll replace it later by uploading your real video — see "What you need to do" below.

## What you need to do
**Two simple steps, in this order:**

1. **Approve this plan** (click *Implement plan*). I'll build the banner with a placeholder video slot.
2. **Upload your real video later.** When your 60–90 second walkthrough is ready, drag-and-drop the `.mp4` into the chat and tell me "use this for the customer flow video." I'll drop it into `public/videos/1325AI-CustomerFlow-3Steps.mp4` and it'll go live immediately.

No copy changes needed elsewhere. The existing `StepVideo` (the two YouTube videos) stays untouched.

## Tip for working with me
If you already have the video file ready *now*, attach it to your next message along with "go" — I'll wire the real video in during the same build instead of using a placeholder. Saves a round trip.
