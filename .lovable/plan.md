# Homepage: Fold the Registration Form + Add Multi-Site Revenue Sharing CTA

Clarence's note is a good call. The registration form (Section 01 → Section 03 → Verification) currently sits fully open on the homepage and eats most of the last screen. Folding it behind a click keeps the page tight and turns registration into a deliberate action.

## What changes

### 1. Collapse the registration form
Replace the always-open form with a compact bar:

```text
┌──────────────────────────────────────────────┐
│  VERIFIED BUSINESS REGISTRY     [100% FREE]  │
│  Register your Black-owned business.         │
│  Free · 48-hour review · Human verified      │
│                                              │
│  [ Register & Get Approved  ▾ ]              │
└──────────────────────────────────────────────┘
```

Clicking the button expands the full existing form in place (smooth open, no page jump). Clicking again collapses it. Nothing about the form itself, its fields, validation, or submission changes — only whether it is shown.

The `#submit-business` link in the hero ("Submit your Business for FREE") will scroll down **and** auto-open the form, so that path still works in one click.

### 2. New card below it — Multi-Site / National Organizations
A second collapsible card in the same style:

```text
┌──────────────────────────────────────────────┐
│  MULTI-SITE / NATIONAL ORGANIZATIONS         │
│  Franchises, church networks, associations,  │
│  and multi-location brands.                  │
│                                              │
│  [ Revenue Sharing Opportunities  ▾ ]        │
└──────────────────────────────────────────────┘
```

Expanding it shows a short explainer (bulk onboarding of member locations, shared revenue on subscriptions and transactions, dedicated Kayla deployment) plus a "Request Information" button linking to the existing partnership page at `/partnership-framework`.

## Technical notes

- Edit `src/components/homepage/BusinessSubmissionBox.tsx`: wrap the header + form in a controlled open/closed state, defaulting to closed, with an accessible toggle button (`aria-expanded`, `aria-controls`). Keep the header band as the always-visible summary in condensed form.
- Add `src/components/homepage/MultiSiteRevenueShareCard.tsx` — same collapsible pattern, static copy, CTA to `/partnership-framework`.
- Render the new card under the submission box in `src/pages/HomePage.tsx` (Screen 3).
- Extend the existing hash handler in `HomePage.tsx` so `#submit-business` sets the box open.
- Styling uses existing tokens (mansablue header band, mansagold accent) — no new colors.

## What I need from you

The revenue-sharing card currently points to the existing `/partnership-framework` page. If you'd rather it collect leads through a dedicated form (name, organization, number of locations), say so and I'll add that instead.
