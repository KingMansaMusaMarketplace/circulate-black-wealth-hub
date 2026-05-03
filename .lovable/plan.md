# Item #6 — CORS + `x-csrf-token` Compliance Sweep

## Audit Result

Scanned all **169** edge functions against the Core memory rule:
> Edge functions MUST include `x-csrf-token` in CORS headers.

**162 / 169 compliant.** Only **7 violations** — a much smaller blast radius than expected.

### Violations by category

**Group A — Shared file (fixes 3 functions at once)**
`_shared/api-gateway-utils.ts` exports a `corsHeaders` constant missing `x-csrf-token`. Three API functions inherit the bug:
- `fraud-api/index.ts`
- `susu-api/index.ts`
- `voice-api/index.ts`

**Group B — Webhook functions (no CORS at all)**
Server-to-server webhooks. CORS isn't strictly required (browsers never call them), but the Core rule says "all edge functions". Adding a standard CORS block + OPTIONS preflight handler is harmless and future-proofs them:
- `handle-email-suppression/index.ts` (Lovable email webhook)
- `handle-subscription-webhook/index.ts` (Stripe)
- `stripe-webhook/index.ts` (Stripe)
- `stripe-webhook-corporate/index.ts` (Stripe corporate)

## Plan

### Step 1 — Fix the shared module (1 edit, 3 functions fixed)
Update `_shared/api-gateway-utils.ts` line 12 to add `x-csrf-token` to `Access-Control-Allow-Headers`:

```text
"Access-Control-Allow-Headers":
  "authorization, x-client-info, apikey, content-type, x-api-key, x-csrf-token"
```

This automatically fixes `fraud-api`, `susu-api`, and `voice-api` since they import this constant.

### Step 2 — Add CORS to the 4 webhooks
For each webhook, add at the top of the handler:

```text
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token, stripe-signature",
};

if (req.method === "OPTIONS") {
  return new Response(null, { headers: corsHeaders });
}
```

Stripe webhooks get `stripe-signature` added so signature verification preflights would work if ever invoked from a browser. The webhook signature validation logic itself is unchanged.

### Step 3 — Verify
After edits, re-run the audit one-liner to confirm `0` functions missing `x-csrf-token` and `0` functions without CORS.

### Step 4 — Strengthen the Core rule
Update `mem://constraints/technical-and-security` to specify the canonical header string so future functions copy the right pattern, preventing drift.

## What this does NOT change

- No business logic touched
- No authentication/JWT verification changes
- No webhook signature verification changes
- No deployments or DB migrations — pure header edits

## Files Edited (5 total)
1. `supabase/functions/_shared/api-gateway-utils.ts`
2. `supabase/functions/handle-email-suppression/index.ts`
3. `supabase/functions/handle-subscription-webhook/index.ts`
4. `supabase/functions/stripe-webhook/index.ts`
5. `supabase/functions/stripe-webhook-corporate/index.ts`
6. `mem://constraints/technical-and-security` (memory update)

## Next After Approval

Once this sweep is done and verified, we move to **Recent error/log triage** with clean CORS signal.
