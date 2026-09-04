# Memorial for Craig L. Stevenson

## Recommendation

Give him a quiet, dignified band of his own on the Team page — placed **after Leadership & Advisors and before the "Join us." call to action** — plus a dedicated memorial page for the full tribute.

Why there: a co-founder should not sit inside the working-staff grid (it reads as if he's still on payroll), and he shouldn't be buried on a page nobody visits. Sitting just below the team, in his own section with breathing room, he is the last person you see before the closing — which is exactly the emotional weight a memorial should carry.

## What gets built

**1. "In Memoriam" band on /team**
- Full-width section, black background with a soft gold hairline top and bottom.
- Portrait on the left in a gold-bordered frame, with a subtle grayscale-to-color treatment on hover.
- Right side: "In Memoriam" in small gold letterspaced type, then his name in the serif display face, "Co-Founder" beneath it, and the dates.
- One short tribute paragraph (2–3 sentences) and a pull quote if you have one from him.
- A small "Read his full tribute" link to the dedicated page.

**2. Dedicated page at /in-memoriam/craig-stevenson**
- Hero portrait, full name, "Co-Founder, 1325.AI", and the dates.
- Long-form tribute: who he was, what he built with you, what he believed.
- The Resolution in Memoriam already produced as a PDF, offered as a download.
- Optional photo strip if you have more images of him.
- Quiet close: "His work continues in every business on this platform."

**3. Small touches**
- Footer link "In Memoriam" so the page is always reachable.
- Page title and description set for search and link previews.
- No animation gimmicks, no gold gradients — restraint is the point.

## What I need from you

1. The **tribute text** (or tell me to draft it and you edit).
2. A **quote from Craig**, if you have one you want on the page.
3. Confirm the dates to display. You told me **August 7, 2016** as his passing — I need his **birth year/date** to show the full span. (Note: earlier we prepared the Resolution assuming a more recent passing; I'll use whatever you confirm here.)
4. Any **extra photos** of him you want on the memorial page.
5. Whether the **Resolution PDF** should be downloadable publicly or kept private.

## Technical notes

- New section added to `src/pages/TeamPage.tsx` between the leadership grid and the CTA; his existing entry stays removed from the working leadership array.
- New page `src/pages/InMemoriamCraigStevensonPage.tsx`, lazy-loaded and routed at `/in-memoriam/craig-stevenson` in `src/App.tsx`.
- Reuses the saved portrait at `src/assets/team/navy_bg/Craig_Stevenson.jpg` (and the CDN pointer already in the project).
- Footer link added in the existing footer nav column.
- Styling uses existing tokens (`mansagold`, `mansablue`, serif display) — no new colors.
