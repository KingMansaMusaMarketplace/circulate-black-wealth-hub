# Make Kayla an expert on every part of 1325 Clinical EMR / EHR

## What I found
Kayla already answers doctors' product questions from one shared "knowledge book" (used in both the pilot and the regular Clinical workspace). It has about 45 topics, but:
- Several screens on the doctor menu have **no topic at all**: Delegation Desk, Kenya IDSR Reporting, National Health Exchange, Pilot Patients (test records), Department / Saved workspace / location picker, and Ask Kayla itself.
- Most topics are only **one or two sentences** with 2-3 steps, so answers can sound thin.
- There is nothing about the **pilot itself** (how to join, test-patients-only rule, how to report a problem, what happens after approval).

## What I will do
1. **Add the missing topics** so every one of the 28 menu screens has its own entry.
2. **Deepen every topic** with:
   - a fuller plain-English explanation of what the screen does and why it helps the doctor
   - step-by-step "how to use it" (5-8 steps)
   - common doctor questions and other words doctors use for it (e.g. "scribe", "dictation", "SOAP note" all lead to AI Note-Taking)
   - how it connects to other screens (e.g. Pre-Visit Chart Prep -> Doctor Day -> AI Note-Taking -> Billing Check)
   - the clear limit (sample data only, no real sending/billing yet)
3. **Add pilot topics**: joining at health.1325.ai/pilot, test-patients-only rule, what to test first, how to report a bug, viewing time, and when real patients become possible (after attorney and privacy agreements).
4. **Add a "tour" answer** so "What can you do?" gets a confident, organized overview of all departments.
5. **Safety stays the same**: Kayla explains the product, never gives patient medical advice, never claims real-patient readiness or a medical license.

## How I will check it
- A new automatic check that fails if any menu screen lacks a Kayla topic.
- Checks that common doctor phrasings ("how do I dictate a note", "what is the delegation desk", "can I use real patients") reach the right topic.
- Re-run all existing Clinical tests (currently 476+).
- Run Kayla's scoreboard as required after a Kayla change.

Not checkable by me: a signed-in live chat as a doctor (your login system blocks my test sign-in). I'll ask you to try 3 sample questions after publishing.

## Technical details
- Expand `supabase/functions/_shared/clinical-product-catalog.ts` (shared by `health-kayla-help` and the AskKayla screen); extend aliases in `clinical-help-intake.ts`.
- Coverage test maps workspace menu IDs to catalog IDs in `src/test/clinical-product-help.test.tsx`.
- Redeploy `health-kayla-help`. No database or login changes.
