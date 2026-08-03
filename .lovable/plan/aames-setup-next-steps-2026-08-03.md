# AAMES Setup — Next Steps

## Where things stand today

Checked the live database and the code:

- The AAMES partner page (`/aames`) is live: logo, contact band, 20% revenue share, Sept 1 2026 launch date, join buttons.
- The leadership dashboard (`/enterprise/aames/dashboard`) is built and working.
- 13 onboarding tasks are seeded.
- **0 leadership seats exist** — so right now nobody at AAMES can open the dashboard. It shows "Leadership access required" to everyone, including their national office.
- **0 chapters** are loaded, 1 test member, 0 revenue events.

So the shell is finished; what's missing is the "turn it on for real people" layer.

## Recommended next steps, in order

### 1. Leadership seats (must happen first)
Build a small admin screen at `/admin/enterprise-orgs` where you can add an AAMES leader by email and role (national leader / chapter leader / staff). When that person signs up or signs in with that email, they automatically get dashboard access. Without this, the dashboard is invisible to AAMES.

### 2. Chapter roster
Add chapter import so AAMES's troops/chapters exist as real rows (name, city, state, leader email). Two ways in: a paste-a-spreadsheet upload on the admin screen, and a manual "add chapter" form. Chapter counts and per-chapter signups then show on the dashboard.

### 3. Member + business signup that actually attributes
Today's join button records a member. The valuable part is business owners. Add a dedicated AAMES-tagged business signup path (`/aames/business`) so every business that comes from AAMES is stamped with the org, feeding the 20% revenue share automatically when they upgrade to a paid plan.

### 4. Revenue share ledger becomes automatic
Wire a trigger: when an AAMES-attributed business pays, write a revenue event with the 20% share. The dashboard already displays these — it just has nothing to display yet.

### 5. Launch kit for AAMES to distribute
A printable/emailable one-pager plus a QR code that points to `/aames`, so their national office can push it to 2.5M members. Also a short "how to invite your chapter" page for chapter leaders.

### 6. Onboarding tasks made real
Let leaders check off their side of the 60-day plan, and let you check off yours, with dates. Currently the 13 tasks are display-only.

## Suggested sequencing

- **This week:** steps 1 and 2 (seats + chapters) — that's what makes the partnership demoable to AAMES leadership.
- **Before Aug 1 pilot:** steps 3 and 5 — attribution and the materials they hand out.
- **Before Sept 1 launch:** steps 4 and 6.

## Technical notes

- New admin page `src/pages/admin/EnterpriseOrgsAdminPage.tsx`, admin-gated route in `src/App.tsx`.
- Seat invites keyed by email in `enterprise_org_leaders` with a lookup on auth so the seat binds on first login; RLS keeps reads to admins and the seat holder.
- Chapter CSV parse client-side, bulk insert into `enterprise_org_chapters`.
- Business attribution: reuse the existing `app_business_attributions` pattern, stamped with `enterprise_org_id`.
- Revenue events: database trigger on paid subscription writes `enterprise_org_revenue_events` at `revenue_share_pct` from the org row.
- No changes to the public `/aames` page design in step 1–2.

## What I need from you

- Confirm the first AAMES leader email(s) to seat.
- A chapter list (spreadsheet or PDF) if you have one; otherwise we start with the national seat only.
