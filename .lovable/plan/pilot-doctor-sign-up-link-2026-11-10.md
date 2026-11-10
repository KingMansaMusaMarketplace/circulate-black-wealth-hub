# Pilot Doctor sign-up link

## My recommendation: yes
You already have a "request access, then you approve" system. Today it's a general form, though. A dedicated pilot link would:
- Give doctors one simple address to click: **health.1325.ai/pilot**.
- Collect pilot details up front, so you know who is testing.
- Show clearly in your approval emails and dashboard that the request is a **Pilot Doctor** request.

## What the doctor sees
1. A short welcome page: "Join the 1325 Clinical Pilot. Test patients only."
2. A form with:
   - full name
   - email
   - phone
   - specialty
   - practice or hospital name
   - city/state/country
   - NPI (the National Provider Identifier, a doctor's 10-digit license ID), optional
   - a checkbox: "I will use made-up test patients only"
3. After they submit: "Thank you. You'll get an email once approved. Check your Spam or Junk folder."

## What you see
- The same approval email you get today, labeled **Pilot Doctor**, with all their details and Approve / Decline buttons.
- In the Admin Dashboard, a **Pilot Doctors** list showing who applied, who you approved, and when each doctor first opened the pilot.

## What stays the same
- Approval still comes only from you. The link alone never grants access.
- Viewing time limits, privacy lock and test-patient-only rules stay unchanged.
- The tester rules PDF and invitation email get updated to use the new link.

## Technical details
- New public page at /health/pilot (in both routers). It reuses the existing health-access request function with a `source: "pilot"` tag plus the extra fields.
- Add nullable pilot columns (specialty, practice, NPI, test-only attestation) to the existing access-request table. The server checks the attestation and rejects requests without it.
- Approval email (approval-email.ts) shows a Pilot Doctor label and the extra fields.
- Admin list filters on source = pilot and shows first-opened time from the existing access deadline data.
- Add tests: requests are rejected without the attestation, and the pilot tag never skips owner approval.
- The edge function deploys with the Supabase CLI, as noted in the project rules.
