# One-Shot Backlog Flush + Keep Strict Verification

## Goal
Promote the ~391 stuck `b2b_external_leads` (status `pending` + `needs_review`) into the `businesses` directory in a single run, while keeping the strict verify-and-promote gate as the default for all new leads going forward.

## Changes

### 1. New edge function: `kayla-bulk-promote-backlog`
File: `supabase/functions/kayla-bulk-promote-backlog/index.ts`

- `verify_jwt = false` (admin-invoked)
- Uses `SUPABASE_SERVICE_ROLE_KEY` internally
- Query target leads:
  - `verification_status IN ('pending','needs_review')`
  - `is_converted = false`
  - Order by `lead_score DESC NULLS LAST, created_at ASC`
  - Batch size 500, parallel chunks of 25
- For each lead:
  1. Normalize `website_domain` (strip protocol/www/path, lowercase)
  2. Normalize `(name, city)` — lowercase, trim, collapse whitespace
  3. **Dedup check** against `businesses`:
     - Skip if any row matches `website_domain`
     - Skip if any row matches `(normalized_name, city)`
  4. Insert into `businesses` with:
     - `listing_status = 'live'`
     - `is_verified = true`
     - `verification_source = 'bulk_backlog_flush'`
     - Map name, description, category, website, phone, email, address, city, state, lat/lng from the lead
  5. Update lead: `is_converted = true`, `converted_business_id = <new id>`, `verification_status = 'promoted_bulk'`
- Returns JSON summary: `{ processed, promoted, skipped_duplicate_domain, skipped_duplicate_name_city, skipped_missing_required, errors }`

### 2. One-shot invocation (no cron)
After deploy, invoke once via the Supabase curl tool. Do NOT schedule it in `cron.job`. Strict `kayla-verify-and-promote` (every 3 min) remains the default path for all newly-discovered leads.

### 3. No schema changes
Reuses existing columns on `b2b_external_leads` and `businesses`. No migration required unless we discover a missing column during implementation, in which case I'll add the minimum needed.

## Out of scope
- Loosening the strict verifier
- Scheduling the bulk promoter on a recurring cron
- Increasing Perplexity `NUM_SEARCHES` (revisit after 24h if volume still lags)

## Verification after run
- Report counts: promoted vs skipped (with reasons)
- Spot-check 5 promoted businesses on `/directory`
- Confirm `b2b_external_leads` backlog (`pending` + `needs_review`, not converted) drops to ~0
