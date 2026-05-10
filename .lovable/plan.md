# Pre-Launch Customer Signup Smoke Test

Goal: simulate a brand-new customer signing up end-to-end so real users on Monday hit zero friction. I'll use the in-browser preview to act as a real customer, then report every issue I find with a fix recommendation.

## What I'll test

1. **Navigate to `/signup`** on the live preview as an unauthenticated visitor.
2. **Fill the Customer signup form** with realistic throwaway data:
   - Name, email (unique `qa+<timestamp>@mansamusamarketplace.com`), phone, address, password, confirm password, agree to terms.
3. **Submit** and observe:
   - Network call to Supabase Auth (`/auth/v1/signup`) — status, error body
   - Edge function calls: `auth-rate-guard`, `send-verification-email`, `send-business-notification`
   - Toast / inline error messages
   - Redirect behavior after submit
4. **Verify the welcome + verification emails actually send** by checking edge function logs for `send-verification-email` and `send-business-notification`.
5. **Confirm the new user row** lands in `auth.users` and `profiles` (via read-only DB query).
6. **Try the failure paths** real users will hit:
   - Weak password (under 8 chars)
   - Mismatched confirm password
   - Duplicate email (re-submit same address)
   - Empty required fields
   - Rate-limit behavior (5 rapid submits) → confirms `auth-rate-guard` blocks gracefully
7. **Spot-check the post-signup experience**: does the user land somewhere sensible (verify-email screen, dashboard, or directory)? Is the "check your email" message clear?
8. **Mobile viewport sanity check** (390×844) — make sure form is usable on phone since most Monday signups will be mobile.

## What I'll report back

For each issue found, I'll give you:
- Exact step that failed
- Screenshot
- Console / network / edge-function log excerpt
- Severity (blocker vs. polish)
- Proposed fix (file + change)

## What I will NOT do without your OK

- Modify any code (this is a diagnostic pass first)
- Delete the test user from `auth.users` (I'll list the test emails I created so you can purge or keep them)
- Touch the SMTP / rate-limit settings we just configured in Supabase

## After the test

If everything is clean → I'll give you a green-light checklist for Monday.
If issues exist → I'll come back with a prioritized fix plan you approve before I write code.

Sound good? Hit **Implement plan** and I'll start the run.
