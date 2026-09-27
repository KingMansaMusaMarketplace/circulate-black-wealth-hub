# Make "Claim This Business" remember the listing

## Problem (confirmed)
On a discovered listing, "Claim This Business" sends the owner to the general business sign-up page. That page ignores which listing they picked. They can finish signing up and still have no claim on their business. The "create your account to claim" message also disappears before anyone can read it.

## What owners will experience
1. They tap "Claim This Business" on a listing.
2. The sign-up page shows a clear banner: "You're claiming: [Business Name]." The business name is already filled in.
3. After they create an account (or sign in), their claim request is saved automatically, tied to that exact listing.
4. They see "Claim submitted — our team will verify you shortly."
5. The request appears for you and your reviewers to approve. Once approved, the owner controls the listing.

Owners can't take over a listing on their own. Every claim still goes through your team's check, just like today.

## Steps
1. Sign-up page: read the chosen listing, show the banner, fill in the business name, and remember the listing if the owner leaves and comes back (7 days, one time only, same as the current claim-link fix).
2. After sign-up or sign-in: save one claim request for that listing (duplicates are ignored).
3. Show the claim requests to admins and reviewers with Approve / Reject. Approving uses the existing claim process.
4. Show the explanation message on the sign-up page itself, so owners can actually read it.

## Technical details
- `BusinessSignupPage.tsx`: read `claim` + `name` params; banner; prefill; persist via a `pendingLeadClaim` localStorage entry (7-day, one-shot).
- New table `lead_claim_requests` (lead_id, user_id, status, created_at; unique lead_id+user_id), with GRANTs + RLS: owner inserts/reads own rows; `can_review_businesses()` reads/updates all.
- Submit request after auth in a small hook mounted at app root (next to `PendingClaimRedirect`).
- Approval: a SECURITY DEFINER RPC checks `can_review_businesses()`, then mints a token and runs the existing `claim_business_lead` logic for that user.
- Remove the premature `toast.info` in `use-claim-business.ts`.
