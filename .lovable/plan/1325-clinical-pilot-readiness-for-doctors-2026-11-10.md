# 1325 Clinical pilot: readiness for doctors

## Short answer
- **Real patient information: NOT ready.** Real patients stay locked until the attorney letter, signed vendor agreements (BAAs, or Business Associate Agreements) and the go-live review are complete. The system blocks this by design.
- **Made-up test patients to check the flow: ready to start.** Doctors can enter fictional patients, write and sign notes, use talk-to-type, book appointments and practice billing. None of it is sent to pharmacies, labs or insurers.

## Before sending invitations (this plan)
1. **Signed-in walkthrough.** I can't sign in to your preview myself, so you (or one doctor) do a 15-minute test run while I watch the error logs: add a test patient, write a note, dictate 20 seconds, sign, book an appointment, make a practice claim.
2. **Fix whatever that run turns up.** If there are no problems, nothing changes.
3. **Write the doctor invitation email** from Partner@1325.AI. It covers how to get access, "test patients only, no real names, no SSNs", a 15-minute task checklist, how to report problems, and the Spam/Junk reminder.
4. **Write a one-page "Pilot Tester Rules" PDF** with the logo and confidentiality notice.
5. **Collect feedback.** Doctors reply by email to Partner@1325.AI. I review the replies with you weekly.

## Still needed before real patients (not part of this plan)
- Attorney go-live letter
- Signed BAAs with every vendor (OpenAI, Supabase, email provider, Lovable)
- Risk assessment and clinic agreement recorded in the admin approvals tracker

## Technical details
- No code or database changes unless step 1 finds bugs.
- The go-live lock (hc_real_patients_allowed) stays untouched.
