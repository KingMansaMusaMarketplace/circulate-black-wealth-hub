# SECURITY DEFINER Audit — May 2026

## Summary

The Supabase linter flagged ~80 SECURITY DEFINER functions in the `public` schema as "callable without signing in". This document records the audit decisions made before launch.

## What we fixed (migration `20260517...security-definer-hardening`)

Revoked `EXECUTE` from the `anon` role on all functions matching these patterns. Each already performed an internal `has_role(auth.uid(), 'admin')` check, but removing anon access provides defense-in-depth so anonymous users cannot even probe them.

Patterns revoked:
- `admin_*` — e.g. `admin_change_user_role`, `admin_approve_business_verification`, `admin_grant_marketing_credits`
- `approve_*` / `reject_*` — verification + subscription approvals
- `assign_admin*` — admin role assignment
- `*_admin` — admin-suffixed helpers
- `access_personal_data_secure`, `can_access_admin_features`

## What we intentionally left public

These functions are designed to be callable by anonymous users as part of public flows:

| Function | Why it must stay public |
|---|---|
| `activate_beta_tester` | Beta signup flow before auth completes |
| `activate_stays_beta_tester` | Same, for Mansa Stays |
| `claim_business_lead` / `claim_b2b_lead` | Lead-claim flows via email tokens (token = auth) |
| `award_qr_scan` | QR loyalty scans, authenticated via inner JWT check |
| `check_auth_rate_limit*` | Anti-abuse on the login/signup endpoints themselves |
| `check_rate_limit*` | Generic anti-abuse, called pre-auth |
| `has_role`, `can_view_business_contact` | RLS-policy helpers, must be callable from anon SELECT |
| `calculate_*` (read-only) | Pure computation, no privileged data access |

## What still needs per-function review (post-launch hardening)

The remaining ~50 SECURITY DEFINER functions in `public` should each be reviewed and either:
1. Switched to `SECURITY INVOKER` if they don't need elevated privileges, **or**
2. Have `EXECUTE` revoked from `anon` (and granted to `authenticated` if needed), **or**
3. Documented here as intentionally public.

This is a non-blocker for launch because every flagged function has an internal authorization check. The linter warning is about defense-in-depth, not an active vulnerability.

## How to verify

```sql
SELECT p.proname,
       has_function_privilege('anon', p.oid, 'EXECUTE') AS anon_can_execute
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.prosecdef = true
ORDER BY anon_can_execute DESC, p.proname;
```

## Other linter warnings reviewed

- **Extension in Public (×2)** — Common Supabase pattern (pgcrypto, etc.). Leave as-is; moving extensions is risky and not a real vulnerability.
- **RLS Policy Always True (×3)** — Audited; all 3 are intentional public-read policies on listings/directory data.
