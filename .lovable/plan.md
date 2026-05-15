# Admin Gaps Buildout — 12 Items, Phased

You confirmed all 12 gaps. Here is the rollout. Each item ships as its own batch so you can review between batches. I'll start with #1 (Noire Rideshare admin) immediately after you approve.

## Batch A — Symmetric Operations (biggest ROI)

### #1 Noire Rideshare Admin (mirrors Mansa Stays)
A new top-level admin section `NoireRideshareAdmin.tsx` with 6 tabs:
- **Drivers** — list, verification status, vehicle docs, payout method, deactivate
- **Rides** — search, filter by status (requested/accepted/in_progress/completed/cancelled), refund/cancel actions
- **Payouts** — owed-by-driver, payout history, mark paid, CSV export
- **Pricing** — base fare, per-mile, per-minute, surge multipliers (editable)
- **Disputes** — rider complaints queue
- **Reporting** — GMV, rides/day, avg fare, top drivers, cancellation rate

Adds sidebar entry "Noire Rideshare". Phased like Mansa Stays (6 sub-phases).

### #2 Refund Execution (real Stripe refunds)
Wire the existing "Refund" buttons in Mansa Stays bookings (and new Noire rides) to a `process-refund` edge function that:
- Looks up the Stripe `payment_intent_id` on the booking/ride
- Calls `stripe.refunds.create()` with optional partial amount + reason
- Writes the result to the existing refund record
- Logs to `admin_audit_log`
Adds a confirmation dialog with amount + reason picker.

### #3 Subscription / Billing Admin
New tab under Financial: **User Subscriptions**
- Search user by email → shows Stripe customer, active subscription, tier, next renewal
- Actions: change tier, comp 1 month (apply 100% coupon), issue credit, cancel at period end, cancel immediately
- Audit-logged

## Batch B — Approval & Content Queues

### #4 Business Listing Approvals
New tab **Listing Queue** in Verifications area:
- New businesses awaiting approval
- Pending edits to existing listings (diff view)
- Photo moderation queue with approve/reject + reason
- Bulk approve

## Batch C — Trust, Safety, Cost Visibility

### #5 QR Scan Fraud Monitor
New tab in FraudDetectionDashboard: **QR Patterns**
- Same user scanning same business >X/day
- Same IP across many users
- Geographically impossible scans
- One-click block user / block business

### #6 Kayla Agent Cost Meter
New panel in KaylaAgentReports:
- Per-agent token usage and $ cost (last 24h / 7d / 30d)
- Cost per successful task
- Top expensive agents
- Soft cap warning at configurable thresholds
Requires logging tokens on each agent run (small migration).

## Batch D — Investor & Comms

### #7 Investor Portal Admin
New hidden admin page `/admin/investor-portal`:
- NDA signers list (name, email, signed_at, IP)
- Documents downloaded per signer
- Last access timestamp
- Revoke access

### #8 Email Deliverability
New tab in Email Analytics: **Deliverability**
- Pull bounces/complaints from Resend API
- Bounce rate, complaint rate (24h/7d/30d)
- Blocked recipient list with unblock action

### #9 Broadcast Targeting
Upgrade BroadcastAnnouncements with target filters:
- By tier (free, founding, premium)
- By city/state
- By role (customer, business, sales_agent)
- Preview recipient count before send

## Batch E — Ops Hardening

### #10 Backup & Restore One-Click
New tab in ArchiveRecovery: **Snapshots**
- List Supabase point-in-time snapshots
- Trigger on-demand snapshot
- Restore-to-staging button (read-only confirm)

### #11 Audit Log Filtering
Upgrade AdminAuditLog:
- Filter by actor (user search), action type (dropdown), table, date range
- CSV export of filtered results

### #12 Roles UI Granularity
Upgrade AdminRolesManager:
- Custom permission sets beyond admin/moderator/user
- Per-permission toggles (view financials, refund, change roles, moderate, etc.)
- Assign permission set to user
Requires a `permission_sets` and `user_permissions` table.

## Technical Notes

- Each batch = 1 sidebar entry or tab additions, 1–3 edge functions, 1 migration where needed
- All actions audit-logged via existing `admin_audit_log`
- All tables get the same SearchToolbar + CSV export pattern from Mansa Stays
- Stripe-touching actions (#2, #3) need confirmation dialogs and admin role check server-side
- #6 and #12 require new tables; the rest reuse existing schema

## Delivery Order

I'll ship Batch A first (the biggest 3), pause for your review, then continue B → E. Each batch is 2–4 messages of work.

Ready to start with #1 Noire Rideshare admin Phase 1 (schema + Drivers tab) the moment you approve.
