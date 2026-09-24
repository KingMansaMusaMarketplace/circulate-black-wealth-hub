# Give Maurice and Clarence access to only the Business Review Queue

## Recommendation
Do NOT make them full admins. Admin access would open every admin page (campaigns, payments, investor data, Kayla scoreboard). Instead, create a new limited role called **Business Reviewer** that unlocks only the Business Review Queue.

## What they will experience
- They sign in with their own account and password (each sets their own).
- They see a "Business Review" link and can approve, reject, or ask for more info on listings.
- Any other admin page shows "Admin Access Required."
- You can remove their access anytime.

## Steps
1. Add a "reviewer" access level, stored in the existing secure roles list (not on their profile, so it can't be faked).
2. Add a server-side check "is this person an admin or a reviewer?"
3. Protect the Business Review page with that check (admins still get in).
4. Allow reviewers to read and update only the business-review records behind that page, nothing else.
5. Record who approved or rejected each business, so you can see Maurice's and Clarence's decisions.
6. Give the reviewer role to Maurice and Clarence once they have created accounts.

## What I need from you
- The email each of them signed up with (e.g. maurice@1325.ai, clarence@1325.ai). They must create accounts at 1325.ai/signup first.
- Say "go" to build.

## Technical details
- Add `reviewer` value to `app_role` enum; insert rows into `user_roles`.
- New SECURITY DEFINER function `can_review_businesses()` = admin OR reviewer.
- New `RequireReviewer` route guard; wrap `/admin/business-review` (3 route entries in App.tsx).
- Audit the tables/RPCs used by `BusinessReviewQueue.tsx`; add RLS policies/RPC checks allowing reviewers, without widening other admin functions.
- Reviewer actions logged with reviewer user id.
