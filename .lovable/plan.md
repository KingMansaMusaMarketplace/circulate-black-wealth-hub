# Restore Kayla Discovery Throughput

## Problem
Last 24h only 15 verified businesses inserted (vs. perceived "600/hr"). Root causes:
1. `details` JSON in `kayla_run_log` is empty `{}` on completed runs — can't see funnel
2. 9-minute self-lockout skips ~50% of cron triggers
3. Duplicate cron jobs racing into the lockout
4. Verification gate may be over-rejecting (unknown without step 1)

## Changes

### 1. `supabase/functions/kayla-auto-discover/index.ts`
- Ensure the completion `kayla_run_log` insert writes a populated `details` object: `candidates`, `inserted`, `skipped_duplicate`, `skipped_low_confidence`, `skipped_no_website`, `skipped_no_phone`, `skipped_no_address`, `perplexity_errors`, `num_searches`, `duration_ms`
- Shorten self-lockout from 9 min → 2 min (line ~884)
- Add a top-level `console.log` summary line for the funnel for easy log scanning

### 2. SQL migration — dedupe cron jobs
- Inspect `cron.job` for all `kayla-auto-discover` entries
- Unschedule duplicates, keep ONE entry running `*/5 * * * *`
- Keep `kayla-auto-discover-businesses-v2` unscheduled (per `.lovable/plan.md`)

### 3. Manual test run after deploy
- Invoke the function once via curl
- Read the new `details` row to identify the real bottleneck (Perplexity empty? gate too strict? dedup?)
- Report findings back before touching the verification gate or `NUM_SEARCHES`

## Out of scope (next round, after diagnostics)
- Loosening verification thresholds
- Increasing `NUM_SEARCHES` above 120
- Swapping Perplexity for another provider
