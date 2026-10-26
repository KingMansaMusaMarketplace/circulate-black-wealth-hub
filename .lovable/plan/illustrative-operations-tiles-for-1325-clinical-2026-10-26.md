# Illustrative operations tiles for 1325 Clinical

## Board Check
This is a proposed design review, not an independent clinical or legal endorsement.
- **Kayla, chair:** Keep the clinician’s existing dashboard intact; add practical operational visibility.
- **Clinic operations:** Show patient flow and supply exceptions without adding a live management system.
- **Commercial review:** Clearly separate fictional cash/mobile-money examples from insurance amounts awaiting payment.
- **Clinical safety:** No patient entry, prescribing, dispensing, payment processing or insurance submission.
- **Security:** A browser connection signal must never imply working offline records or clinical syncing.

**Verdict: Proceed with safeguards, subject to Thomas’s approval.**

## What will be added
Add four coordinated tiles to the **Dashboard** in both the private presentation and signed-in sample workspace. Place them below the existing summary counters and above the schedule and Kayla’s brief. Preserve the existing clinical colors, navigation, access restrictions and other dashboard content.

### 1. Patient Flow — illustrative
- Show fixed fictional examples across **Waiting → Triage → With clinician → Visit complete**.
- Include stage counts and illustrative elapsed waits, with a named sample scenario rather than pretending this is today’s live activity.
- Selecting a stage reveals its fictional entries inline; no dragging, queue updates or patient registration.
- Keep operational queue examples separate from existing chart evidence and saved appointments. A fictional completed visit is not an actual completed service.

### 2. Collections — illustrative Kenya scenario
- Show **Cash** and **M-Pesa** examples in Kenyan shillings (KES), with a small breakdown graphic and a correctly summed illustrative collections total.
- Show **Social Health Authority (SHA) amounts awaiting payment** separately; do not count them as money received or imply confirmed reimbursement.
- Make the sample scenario date explicit. These numbers are invented demonstration figures, not prices, forecasts or real transactions.
- An expandable breakdown shows the same fixed sample amounts. No checkout, receipts, payer checks or connection to any payment or insurance service.

### 3. Dispensary Supply Alerts — illustrative
- Show fixed example stock quantities, a sample minimum threshold and low-stock/adequate statuses for a small list of supplies.
- Selecting the tile expands the sample inventory list; no edits, purchase orders, dispensing, prescribing or supplier connection.
- Mark thresholds as demonstration assumptions, not clinically recommended stock levels. Do not imply a functioning pharmacy inventory system.

### 4. Browser Connection
- Display the actual browser-reported **Online / Offline / Unknown** state, visually separate from the fictional operations figures.
- Always identify clinical offline records and syncing as **Unavailable in this preview**. Online does not prove the clinical service is reachable.
- Offline must not queue clinical actions, cache patient records or imply that approval/session deadlines pause.
- No “last synced” time, fabricated connection health, or claim of a live M-Pesa/SHA connection.

## Presentation and boundaries
- Use a compact two-column layout on larger screens and a single-column layout on smaller screens, with readable labels and no overlapping content.
- Label each fictional tile **Illustrative · sample data only**; retain **1325 Clinical EMR / EHR — Private preview · sample data only** and the existing prominent patient-information warning.
- Use clear icons, familiar controls, keyboard-accessible details and status text rather than relying on color alone.
- Expanded details remain local and reset when leaving the dashboard or losing access. No new free-text inputs, uploads, saved operational data, exports or delivery.
- Do not change pricing, private viewing duration, approvals, account permissions, Kayla’s reasoning or existing clinical workflows.

## Technical implementation
- Add one shared `ClinicalOperationsTiles` presentation component and a small typed fictional-scenario module under `src/pages/health/workspace/`.
- Reuse that component in the existing dashboard in `HealthDemoPage.tsx` and `workspace/Screens.tsx`; no new pages or routes. Preserve current summary counters and loaders.
- Use existing clinical design tokens, Button, Badge and disclosure/dialog patterns; render small charts from the fixed scenario rather than adding a dashboard/chart dependency.
- Use a minimal browser-status listener with cleanup and no toast, retry, persistence or action queue. Do not reuse the offline-support hooks that queue writes.
- Keep illustrative operations independent of `hc_*` records and facility permissions; do not derive fictional collections from existing sample claims or assert evidence-backed stock/queue data.
- Record the shared fictional-only operations boundary in the clinical `AGENTS.md` during implementation. No database migration, new service or deployment is needed.

## Checks before delivery
- Add focused tests beside existing clinical tests for collections arithmetic, SHA exclusion from received totals, stock-threshold behavior, queue-count consistency and absence of clinical writes/transport.
- Test browser-state changes and listener cleanup, with offline syncing remaining unavailable in every state.
- Run the new tests and adjacent billing/safety regression tests; check the preview’s automatic compilation result.
- Inspect dashboard details and layout at computer and phone sizes. Verify access restrictions remain in place.
- Attempt the signed-in dashboard flow only with an available authorized session; if external sign-in prevents it, report that limitation rather than substituting a fictional login or claiming full verification.

## Approval and delivery
Approval covers these four illustrative tiles only, not live Kenyan clinic operations or a launch commitment. After approval, implement and verify them; publishing remains a separate action requested by Thomas.