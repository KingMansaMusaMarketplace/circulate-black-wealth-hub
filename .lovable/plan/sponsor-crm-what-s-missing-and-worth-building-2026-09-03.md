# Sponsor CRM — what's missing and worth building

Right now `/admin/sponsor-crm` has three working pieces: the pipeline board (drag cards between stages), the Outreach Targets tab (28 companies with copy-email buttons), and an Add Prospect form. But several things the database already supports are not wired into the screen yet.

## Gaps found

1. **Clicking a prospect card does nothing.** There is no detail view, so you can't see or edit notes, contacts, deal value, or history.
2. **Activity logging is built but unused.** The system can already store calls, emails, and meetings per prospect — nothing in the UI writes to it.
3. **Follow-ups are loaded but never shown.** Overdue and upcoming follow-ups are fetched and thrown away.
4. **Copy-only email.** You must paste into Gmail manually; no record is kept that the email went out.
5. **No owner view.** You can't filter to "just Clarence's list" or "just mine."
6. **No export.** Nothing to hand a partner or advisor as a spreadsheet.

## Proposed build (recommended order)

### 1. Prospect detail drawer (highest value)
Click any card → side panel with:
- Editable fields: contact name, title, email, phone, deal value, probability, expected tier, next follow-up date, notes
- Stage selector
- Activity timeline (calls/emails/meetings logged so far)
- "Log activity" form: type, subject, outcome, notes
- The tailored outreach email with Copy and "Open in email app" buttons
- Delete prospect

### 2. Today's Follow-Ups panel
A strip at the top of the Pipeline tab: overdue in red, due this week in amber. One click opens the prospect. This turns the CRM into something you check every morning.

### 3. Mark as Contacted (one click)
On the Outreach Targets tab, next to Copy email: a button that logs an email activity, sets last-contacted date, moves the prospect to "Outreach," and sets a follow-up reminder 5 business days out. This is what keeps the pipeline honest.

### 4. Owner + status filters
Filter chips: All / Thomas / Clarence, plus tier and stage filters, on both tabs.

### 5. Export to CSV
Button that downloads the current filtered list — company, tier, owner, stage, contact, deal value, last contact, next follow-up.

### 6. Pipeline health strip (optional, later)
Small numbers row: emails sent this week, meetings booked, prospects with no contact in 14 days, projected sponsor revenue if 30% close.

## Not recommended right now
- **Sending email directly from the app.** Enterprise partnership emails go through official portals or land better from your own inbox; automated sends risk spam filters. Copy + "open in mail app" is the right call until volume justifies it.
- **Auto-enriching contacts from the web.** Fabricated or stale executive emails would hurt more than help.

## Technical notes
- No new database tables needed. `sponsor_prospects` and `sponsor_outreach_activities` already exist with the required columns; `custom_fields` already holds tier, owner, portal URL, phone, and pitch angle.
- Work is confined to: a new `SponsorProspectDrawer.tsx`, a new `FollowUpsPanel.tsx`, edits to `SponsorPipelineKanban.tsx` (wire the existing `onProspectClick`), `SponsorTargetList.tsx` (Mark as Contacted + filters), and `AdminSponsorCRM.tsx` (compose the new pieces).
- The hook `use-sponsor-crm.ts` already exposes `updateProspect`, `logActivity`, `useProspectActivities`, `followUps`, and `deleteProspect`, so no new data layer is required.
- Export is client-side CSV generation; no backend change.

## What you'd do next
Approve, and I'll build items 1–5 in one pass. Item 6 can follow once you've got real activity data flowing.
