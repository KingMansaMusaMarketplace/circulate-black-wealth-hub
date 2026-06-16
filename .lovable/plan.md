# Update Plan Selection to reflect Kayla + 42 AI services

**Page:** `/business-signup` → `src/components/auth/forms/business/PlanSelection.tsx`
**Goal:** Make the "42 services" claim concrete by listing every service the Pro plan unlocks, grouped by the 9 Kayla departments.

## What changes (plain English)

Right now the Pro plan just says *"Full Kayla AI concierge suite (42 services)"* — a number with nothing behind it. After this change, anyone choosing a plan can click **"See all 42 services"** and instantly see what Kayla and her team actually do, grouped into the 9 departments. Nothing else on the signup flow changes.

## The 9 departments + counts (from the live agent roster)

| # | Department | Count | Examples |
|---|---|---|---|
| 1 | Executive | 9 | Kayla (CEO), CRO, CFO, CMO, COO, CTO, CGO, IP Shield, IR Officer |
| 2 | Marketing | 7 | Review Manager, SEO Specialist, Brand Monitor, Content Creator, B2B Partnership Scout, Outreach Specialist, PR Strategist |
| 3 | Finance | 6 | Bookkeeper, Cash Flow Analyst, Grant Researcher, Credit Advisor, Tax Preparer, Collections Agent |
| 4 | Operations | 6 | Records Clerk, Loyalty Manager, Supply Chain Lead, Scheduler, Inventory Manager, Legal Drafter |
| 5 | Community | 5 | Impact Analyst, Diversity Compliance Officer, QR Loyalty Engineer, Events Coordinator, Mentorship Scout |
| 6 | Hospitality | 3 | Stays Concierge, Pricing Optimizer, + 1 more |
| 7 | Mobility | 2 | Noire Rideshare dispatch + safety |
| 8 | Automation | 2 | Workflow + integration agents |
| 9 | Risk | 2 | Fraud + compliance watch |
| | **Total** | **42** | |

(Exact names will be pulled from the `AI_EMPLOYEES` constant — single source of truth, no duplication.)

## Implementation steps

1. **Extract a tiny helper** at the top of `PlanSelection.tsx` (or a new sibling file `kayla-services.ts`) that imports `AI_EMPLOYEES` from `KaylaAITeam.tsx` and reduces it into `{ department, count, members[] }`. Only the names + departments are needed — no icons.
2. **Add a collapsible block** to the Pro plan card (`kayla_pro`). Default collapsed. Trigger: `<button>See all 42 services ▾</button>` styled like a subtle link, keyboard-accessible.
3. **Render** the 9 departments as a 2-column grid (1 column on mobile) of small department cards: department name + count badge + bullet list of services.
4. **Keep existing features list** above the toggle so the card still scans quickly when collapsed.
5. **Accessibility:** `aria-expanded`, `aria-controls`, focus ring matches Tailwind tokens; respect `prefers-reduced-motion`.
6. **No copy changes** to the other 3 plan cards (Free, Essentials, Starter).

## Technical notes

- One file edited: `src/components/auth/forms/business/PlanSelection.tsx`. Optional: one new file `src/components/auth/forms/business/kayla-services.ts` to keep the roster transform out of the JSX.
- Reuse existing `Card`, `Badge`, `Check` icon — no new dependencies.
- Use `useState` for the toggle; no global state.
- Verify by reading the file post-edit and visually checking on the preview at `/business-signup`.

## Out of scope

- Pricing changes
- Homepage Meet Kayla section
- `/kayla/team` page
- iOS variant of the signup card (already short-circuits to the green "Full Platform Access" card)

## Next step for you

Approve and I'll implement, then point you to the Pro card on `/business-signup` to verify.
