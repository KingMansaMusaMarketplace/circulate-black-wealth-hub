# SECURITY DEFINER Audit — May 2026 (updated July 2026)

## Summary

Supabase linter previously flagged 254 `SECURITY DEFINER` functions in `public` as callable without signing in. After the July 2026 hardening migration, that number is down to **90** — all intentionally public.

## July 2026 hardening

Migration: `harden security definer functions v2`.

- Revoked `EXECUTE` from **both `PUBLIC` and `anon`** on all non-whitelisted SECURITY DEFINER functions (previous round only revoked from `anon`, which was overridden by the default `PUBLIC` grant).
- Re-granted `EXECUTE` to `authenticated` and `service_role` so signed-in users and edge functions keep working.
- Result: anon-callable count dropped from **254 → 90** (−164 linter warnings).

## Intentional public whitelist (~90 functions)

These are the only SECURITY DEFINER functions anonymous visitors can call. Each is either required for public flows or performs its own auth check internally.

| Group | Examples | Why public |
|---|---|---|
| RLS helpers | `has_role`, `is_admin*`, `is_business_owner*`, `can_view_business_contact` | Called from RLS policies evaluated as caller |
| Rate limiters | `check_auth_rate_limit_*`, `check_rate_limit*`, `check_api_rate_limit`, `check_ai_assistant_rate_limit` | Anti-abuse on pre-auth endpoints |
| Beta signup | `activate_beta_tester`, `activate_stays_beta_tester`, `redeem_beta_code` | Pre-auth activation flows |
| Token-authenticated | `claim_business_lead`, `claim_b2b_lead`, `verify_claim_token`, `get_invitation_by_token` | Token = auth |
| QR loyalty | `award_qr_scan`, `track_qr_scan` | JWT validated inside |
| Public directory reads | `get_directory_*`, `get_public_*`, `search_public_businesses`, `search_directory_businesses`, `search_safe_businesses`, `search_lease_listings`, `get_businesses_by_*`, `get_nearby_businesses`, `list_landing_*`, `list_city_category_counts` | Public site data |
| Public stats/leaderboards | `get_platform_stats`, `get_active_campaigns`, `get_impact_leaderboard`, `get_agent_leaderboard`, `get_campaign_leaderboard`, `get_coalition_stats`, `get_platform_commission_summary`, `get_founding_slots_claimed_count`, `get_business_referral_info`, `get_public_external_leads`, `get_public_profile_info`, `get_public_referral_codes*` | Public marketing surfaces |
| Validators / sanitizers | `validate_input`, `validate_referral_code`, `validate_uuid_input`, `sanitize_text_input` | Client-side form validation |
| Pure calculators | `calculate_asset_depreciation`, `calculate_business_impact_scorecard`, `calculate_coalition_tier`, `calculate_profile_completion`, `calculate_team_bonus`, `get_tier_multiplier` | No privileged data access |
| Auth triggers | `handle_new_user`, `handle_new_user_referral` | Fire on new signups |
| Misc RLS/user | `get_user_role`, `has_confirmed_booking_for_property`, `has_transacted_with_business`, `is_valid_stays_beta_code` | RLS/policy helpers |

## What we locked down

Everything else, including all admin actions, payments, marketing credits, notifications, fraud tools, application review, document URLs, account deletion, cashier PINs, generation helpers, cleanup jobs, agent/tier updates, etc. Anonymous callers now receive a permission error instead of the function running (each already had internal auth checks — this is defense-in-depth).

## How to verify

```sql
SELECT count(*) FILTER (WHERE has_function_privilege('anon', p.oid, 'EXECUTE')) AS anon_execable,
       count(*) AS total_secdef
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.prosecdef = true;
-- Expected: anon_execable ≈ 90, total_secdef ≈ 262
```

## Rollback

If a public flow breaks with error `42501` (permission denied for function ...), grant it back one line:

```sql
GRANT EXECUTE ON FUNCTION public.<name>(<args>) TO anon;
```

Then add the function name to the whitelist array in a follow-up migration.

## Other linter warnings reviewed

- **Extension in Public (×2)** — Common Supabase pattern (pgcrypto, etc.). Leave as-is.
- **RLS Policy Always True (×3)** — Audited; all 3 are intentional public-read policies on listings/directory data.
