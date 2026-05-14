# Conversion Push: Top 3 Quick Wins

**Context:** 1,511 visitors, 0 registered businesses, 0 paying customers. Goal: convert traffic into Founding 100 signups so we can walk into the seed raise with traction, not just a product demo.

---

## 1. Sticky "List Your Business — Free" CTA + Founding Counter

**What the user sees:**
- A slim sticky bar at the top (or bottom on mobile) of the homepage that's always visible as they scroll.
- Reads something like: **"List Your Business — Free • Only X of 100 Founding spots left"** with a gold "Claim Your Spot" button.
- The counter is live — pulls from the existing `useFoundingSlots` hook we already have (`FoundingSlotBadge` component).
- Dismissible (X button) so it doesn't annoy returning visitors, but reappears next session.

**Why this matters:** Right now only 56 of 1,511 visitors (3.7%) ever see the business signup page. A persistent CTA is the single highest-impact change — industry data shows sticky CTAs lift conversion 10–25%.

---

## 2. Free Kayla Demo Section on Homepage

**What the user sees:**
- A new section on the homepage (above the fold or just below the hero) titled something like **"Meet Kayla — Your AI Business Manager. Try her free."**
- A simple chat-style box where a visitor can type a question (e.g. "How would you handle my Instagram?") and get a real Kayla response — no signup required.
- After 2–3 messages, a soft prompt: **"Want Kayla working for your business 24/7? Claim your Founding spot →"**
- Shows the $12,100/mo savings number prominently nearby.

**Why this matters:** Visitors don't understand what 1325.AI does until they experience Kayla. Letting them try her with zero friction is the "aha moment" that converts curiosity into signups. This is the same playbook ChatGPT used — let people try it, then ask them to commit.

**Note:** We'll rate-limit by IP (3 messages per visitor per day) to control AI costs.

---

## 3. Business Signup Funnel Analytics Dashboard

**What the user sees:**
- A new admin-only page at `/admin/funnel` with a visual conversion funnel:
  ```
  Homepage visits      →  1,511  (100%)
  Clicked "List Business" → ???  (??%)
  Reached signup form  →  56     (3.7%)
  Started filling form →  ???    (??%)
  Completed signup     →  ???    (??%)
  ```
- Drop-off percentages between each step shown in red/yellow/green.
- Last 7 / 30 / 90 day toggle.
- Top exit pages list (where visitors leave from).

**Why this matters:** Right now we're flying blind. We know visitors come in, but we have no idea WHERE they leave. This dashboard tells us exactly which step to fix next — and gives us the metrics to show investors ("we improved business signup conversion from 0.5% to 4% in 30 days").

---

## How they work together

These three pieces form a complete funnel:
1. **Sticky CTA** drives more people TO the signup page
2. **Kayla demo** convinces them WHY they should sign up
3. **Funnel dashboard** tells us which step to optimize NEXT

After 2 weeks of data, we'll know exactly where to focus the next round of improvements (e.g. simplify the signup form, add testimonials, etc.).

---

## Technical Details

**Sticky CTA component:**
- New `src/components/marketing/StickySignupBar.tsx`
- Mounted in homepage layout (not on /business-signup itself)
- Uses existing `useFoundingSlots` hook
- localStorage flag `sticky_cta_dismissed_v1` for dismissal
- Hidden on iOS native per existing platform constraint

**Kayla demo widget:**
- New `src/components/homepage/KaylaDemoSection.tsx`
- Calls a new edge function `kayla-public-demo` (no auth required)
- Rate limit: 3 messages per IP per 24h, stored in a new `public_demo_usage` table
- Reuses existing Kayla agent prompt/personality from `kayla-agent-router.ts`
- Logs every demo conversation to a new `public_demo_conversations` table for later analysis

**Funnel dashboard:**
- New page `src/pages/admin/FunnelAnalyticsPage.tsx` (admin-only via existing `has_role` check)
- New event tracking added to: homepage CTA clicks, signup page views, form field interactions, submit success/failure
- New table `funnel_events` (event_name, session_id, user_id nullable, metadata jsonb, created_at)
- Aggregation query computes conversion rates per step
- Recharts funnel visualization

**Database migrations needed:**
- `public_demo_usage` (ip_hash, message_count, window_start)
- `public_demo_conversations` (session_id, messages jsonb, ip_hash)
- `funnel_events` (event tracking)
- All with RLS — admin-only read, service-role write

**Estimated build:** 3 focused work sessions. We'd build them in this order so each one starts producing value immediately:
1. Sticky CTA (fastest, immediate lift) — ~30 min
2. Funnel dashboard + event tracking (so we can measure #1 working) — ~90 min
3. Kayla demo (highest impact but most complex) — ~2 hours

---

## What you'll need to do after I build it

1. **Watch the funnel dashboard daily for the first week** — tell me which drop-off is biggest and we'll fix it next.
2. **Share the homepage on LinkedIn / Facebook** — the sticky CTA + Kayla demo combo needs traffic to prove itself. Even 50 new visitors with this funnel could land your first 5 signups.
3. **Be ready to respond** — when business signups start coming in, you'll get email notifications. Reply within an hour. First-touch speed is the #1 conversion factor at this stage.

Ready to build? Hit "Implement plan" and I'll start with the sticky CTA.