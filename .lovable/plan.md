# Pre-Launch QA: Business Owner Signup Flow

Great idea — with real owners arriving Monday, we should walk the full path ourselves first using a fake business and fix anything that breaks. Here's how I'll do it.

## Test Persona

- **Business:** "Harper & Vine Coffee Roasters" (fictional)
- **Owner:** Jordan Harper
- **Email:** a throwaway test address (e.g. `qa+harpervine@1325.ai`)
- **Category:** Food & Beverage (picked from the new dropdown)
- **Address:** real Chicago address so geocoding works
- **Phone, website, description:** fully filled

## What I'll Walk Through

1. **Signup** — `/auth` → create account as `user_type: business`
2. **Email verification** — confirm the verification email arrives and the link lands on `/email-verified`
3. **Login** — sign back in, confirm session + UserMenu shows name (not duplicated email — Lisa's fix)
4. **Business Registration form** (`BusinessForm`)
   - Basic Info: name, **Category dropdown** (Lisa's fix), description
   - Location: address, city, state, zip
   - Contact: phone (with the looser regex), email, website
   - Submit → confirm `saveBusinessProfile` succeeds (no "permission denied" — Lisa's fix #1)
5. **Post-save checks**
   - Profile re-loads correctly on refresh
   - Business appears on `/directory`
   - Logo/banner upload works
   - QR code generation works
6. **Edit flow** — change a field, re-save, confirm update path works
7. **Logout / re-login** — confirm everything persists

## What I'll Check At Each Step

- Console errors
- Network failures (4xx/5xx)
- Validation messages that block valid input
- Toasts (success vs. error)
- Visual issues at the current 1575px viewport + a quick mobile pass

## Deliverable

A short report listing:
- ✅ Steps that worked cleanly
- ⚠️ Anything that needs a fix before Monday, with the exact file + line and a proposed patch
- 🔧 Fixes I apply during the run (after you approve switching to build mode)

## Notes / Caveats

- I'll need to actually create an auth user in your Supabase project. I'll use a clearly-marked test email so you can delete it after (or I can clean it up at the end).
- Email verification: if SMTP is restricted, I may need to mark the test user verified via a migration to continue the flow. I'll flag this if it happens rather than working around it silently.
- I won't touch any real owner data.

Approve this and I'll switch to build mode, run the walkthrough, fix any blockers in real time, and hand you the report.