# AAMES Enterprise Edition — Build Plan

## What we are building

A private, branded workspace for AAMES (amescouts.org) that delivers exactly what the Enterprise Partnership Dossier promises: Kayla plus the 42 Agentic AI Employees working as AAMES's back office, with a member-business directory funnel underneath it.

AAMES pays nothing. The revenue comes from their member business owners upgrading to paid plans, plus the 20% revenue share on directory-driven revenue starting Day 60.

## The core idea: an "Enterprise Org" layer

Right now the platform is built around individual businesses and individual users. AAMES needs a layer above that: an organization that owns members, chapters, and a leadership dashboard.

We build this once, as a reusable **Enterprise Org** feature — so the next denomination, fraternity, or civic body plugs in the same way. AAMES is simply the first tenant.

```text
  Enterprise Org (AAMES)
    ├─ Leaders        → dashboards, daily brief, agent outputs
    ├─ Chapters/Units → local troops or congregations
    ├─ Members        → invited via AAMES's own outreach
    └─ Member Businesses → land in the 1325.AI directory (free → paid upgrade)
```

## Recommended build order

### Phase A — The AAMES front door (fastest visible win)
A public, co-branded landing page at `/aames` that AAMES can link from amescouts.org and put in their member emails.

- AAMES + 1325.AI lock-up, their colors alongside ours
- "Your organization has partnered with 1325.AI — claim your free membership"
- Two clear paths: **I'm an AAMES member** and **I own a business**
- A signup form that automatically tags the person as AAMES-affiliated (so we can count and report attribution from day one)

This is the piece that actually drives the member volume the whole deal depends on, so it goes first.

### Phase B — Attribution and org data model
The database work that makes everything else possible.

- Tables for enterprise orgs, org members, chapters, and leader roles
- Every signup that comes through `/aames` (or an AAMES invite code) is permanently attributed to the org
- Businesses created by AAMES members are linked to the org, so revenue share is calculable rather than estimated

### Phase C — The AAMES leadership dashboard
A private route (`/enterprise/aames`) that only approved AAMES leaders can reach.

- **Daily Executive Brief** — the morning brief the dossier promises to Mr. Franklin and Dr. Hill
- **Member growth** — signups, chapters, business registrations, upgrades to paid
- **Agent activity feed** — what the 42 Agentic AI Employees produced (grants drafted, renewals sent, newsletter, compliance log)
- **Revenue share ledger** — transparent running total of directory-driven revenue and the 20% share
- Named leader seats matching the dossier's stakeholder map (Franklin, Hill, Tony, Jesse, Bob, Kenneth, Dr. McPhee)

### Phase D — Wire the divisions to real agent output
Connect the seven divisions in the dossier to the Kayla infrastructure that already exists in the platform, so the dashboard shows real work, not placeholders. Start with the three that matter most in the first 60 days:

1. Executive Office — daily brief
2. Finance & Stewardship — grant pipeline
3. Member Operations — renewal sequences

The other four divisions (Communications, Youth & Programs, Security & Compliance, Impact & Digital Equity) come online in onboarding weeks 5–8, matching the dossier timeline.

### Phase E — Onboarding tracker
A 60-day checklist view both sides can see, mirroring the dossier's week-by-week plan. This makes the partnership feel governed rather than informal, and gives AAMES leadership something concrete to report to their board.

## Why this order

Phase A gets AAMES something they can share with 2.5M members within days — that is the whole revenue engine. Phases B and C make the partnership defensible and measurable. Phase D delivers the promised work product. Phase E keeps everyone accountable to the 60-day clock.

## Technical notes

- New tables: `enterprise_orgs`, `enterprise_org_members`, `enterprise_org_chapters`, `enterprise_org_leaders`, `enterprise_org_revenue_events`. Each gets explicit grants, row-level security, and org-scoped policies via a `has_org_role()` security-definer function so leaders only see their own org.
- Attribution rides on an org slug/invite code captured at signup and stored on the profile, then joined to businesses created by that user.
- The leadership dashboard reuses existing Kayla tables (`kayla_agent_reports`, `kayla_business_insights`, `kayla_run_log`) rather than duplicating agent infrastructure.
- Routes are lazy-loaded and added to `src/App.tsx` in both route trees, consistent with the current structure.
- The dossier's confidential financial figures stay out of the public `/aames` page; they live only behind the authenticated leadership dashboard.

## Open items you may want to decide

- Whether `/aames` should be public or behind a simple access code at launch
- Whether AAMES leaders sign in with email invites from us, or self-register and get approved
- Whether to use AAMES's own brand colors on the co-branded page (we would need their logo file and color spec)
