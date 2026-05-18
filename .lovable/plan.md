# 🛡️ Mansa Stays Launch Hardening — STATUS

Last updated: May 18, 2026

---

## ✅ Phase A — Foundation (DONE)
- ✅ Migration: `listing_status` enum on properties, `cancelled_at`/`stripe_refund_id` on leases, `legal_acceptances` table, `host_applications` table, identity fields on profiles
- ✅ Public view filters to `listing_status = 'approved'` only
- ✅ Admin "Pending Approval" tab in Mansa Stays Admin (approve / reject + reason)
- ✅ Existing properties auto-approved (no disruption)

## ✅ Phase B — Revenue Safety (PARTIAL)
- ✅ `process-lease-refunds` edge function (cron-triggered auto-refund)
- ✅ Manual `refund-lease-fee` flow (pre-existing)
- ⏸️ Stripe Identity verification — **DEFERRED** (functions written but dormant; webhook secret not added)
- ⚠️ **Action required:** schedule the cron job in Supabase SQL Editor (SQL provided in chat)

## ✅ Phase C — Legal + Marketing (DONE)
- ✅ `/legal/hosting-agreement` — placeholder, attorney review needed
- ✅ `/legal/tenant-terms` — placeholder, attorney review needed
- ✅ `/legal/photo-consent` — placeholder, attorney review needed
- ✅ `/stays/become-a-host` — hero + value props + application form → `host_applications`
- ✅ Footer link "Become a Host"
- ✅ SEO meta + JSON-LD on become-a-host page
- (SEO on `/stays` was already in place)

---

## 🟢 Launch readiness
- 🟢 Ready for **soft launch** (friends, family, IL beta hosts)
- 🟡 Not ready for **paid ads** until: attorney review of 3 legal docs + Stripe Identity (optional) + cron scheduled

---

## ⚠️ Outstanding manual steps (non-coding)
1. **Schedule auto-refund cron** in Supabase SQL Editor (SQL provided in last chat message)
2. **Attorney review** of the 3 legal documents — IL law for leases
3. **(Optional) Stripe Identity** — say "turn on identity verification" to wire it up

## 🧊 Frozen / Future
- Host ID verification UX (Stripe Identity) — backend ready, UI reverted to existing dialog
- Email notifications on listing decisions (placeholder — not wired)
- Email when auto-refund issued (suggested, not built)
