# Plan: Noire Rideshare — Beta banner + "Join Rider Waitlist"

## 1. Add Beta banner at the top of `/noir`

In `src/pages/NoirLandingPage.tsx`, inject a navy + gold banner directly above the hero (same style/tone as the new Mansa Stays banner so they look like one product family):

- **Badge:** "BETA"
- **Copy:** "Noire Rideshare is launching in Chicago, Atlanta, Houston, DC, Detroit, NYC & LA — drivers wanted."
- **CTA:** "Apply to drive →" linking to `/noir/drive/apply` (the existing `DriverApplyPage`)
- Full-width strip, navy background, gold accent line, white text — matches Stays exactly

## 2. Relabel rider CTAs (two spots)

Change **"Book a Ride"** → **"Join Rider Waitlist"** in:

- `src/pages/NoirLandingPage.tsx` line ~120 (primary hero CTA)
- `src/components/HomePage/NoirRideCTA.tsx` line ~62 (homepage CTA card)

Both buttons keep their existing route (`/noir/book`) so nothing breaks. The `/noir/book` page already shows the pre-launch booking experience; relabeling the entry point is the honest signal Manus.ai flagged.

## 3. What I'm NOT touching this pass

- The `/noir/book` page itself (waitlist form vs. ride request) — bigger change, separate task
- The "Become a Driver" / "Drive with Noire" buttons — already accurate
- The Hotel & Corporate Partners CTA — already accurate
- Any database changes — none needed

## Verification after build

1. Open `/noir` → gold "Beta — Drivers wanted" banner is visible at the very top
2. Hero primary button reads **"Join Rider Waitlist"** (not "Book a Ride")
3. Open `/` (homepage) → scroll to the Noire card → CTA reads **"Join Rider Waitlist"**
4. Click the banner's "Apply to drive →" → lands on `/noir/drive/apply`

## Follow-up (separate task, your call later)

Turn `/noir/book` into a true waitlist form that captures city + email and stores it in `email_subscriptions` with a `source: 'noir_rider_waitlist'` tag. Then add "You're #X in line for [city]" confirmation, like we discussed.

---

**Reply "go" to approve and I'll ship it.**
