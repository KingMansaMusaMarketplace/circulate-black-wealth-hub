# Full check of every 1325 Clinical workspace screen

## Goal
Open each of the 29 screens in the Clinical workspace menu (Primary Care department) and confirm it loads, its buttons respond, and it shows no errors. Fix anything that is broken. Keep every existing safety rule: fictional sample data only, nothing sent to real labs, pharmacies, insurers or governments, and no real patients.

## Screens covered
Ask Kayla, Connected Doctor Day, Delegation Desk, Expanded Sample Chart, Medication Review Assistance, Clinical Data Explorer, Kenya IDSR Reporting, Clinical Connections, National Health Exchange, Patient Communication, Clinic Intake, Dashboard, Pilot Patients (test records), Patients, Schedule, Pre-Visit Chart Prep, Medical Chronology, CME Files & Review, AI Note-Taking, Care Guide, Billing Documentation Check, Prior Authorization, Practice Impact, Specialty Examples, Billing Preparation, Backup Recovery & Migration, Doctor Evaluation, Executive Quality Overview. I'll also check the department and location picker.

## Steps
1. **Automatic checks.** Run every existing Clinical safety and feature test, and fix any that fail.
2. **Screen-by-screen walkthrough.** Use the public sample (demo) workspace, which needs no sign-in. For each screen I will open it, click its main buttons, take a picture and record any on-screen or hidden errors.
3. **Live AI and server features.** Check that the online services behind these screens are running and turn away people who aren't signed in: Ask Kayla, AI Note-Taking, talk-to-type, sign-in codes and the Epic test connection.
4. **Fix what is broken.** I make small, targeted repairs only, with no redesigns, and re-test each fix.
5. **Report.** You get a simple pass/fail list for all 29 screens, with pictures of anything that was fixed.

## Limitation you should know
This project's sign-in setup won't let me sign in as you. For screens that save to your real pilot clinic (Pilot Patients, Patients, Schedule, AI Note-Taking signing, talk-to-type), I can check the sample version and the online services. I cannot click through them as a signed-in doctor. At the end I will give you a short list of clicks to try yourself, or a doctor tester can do it.

## Technical details
- Run vitest on the clinical test files and the Deno tests for the health-* functions.
- Run a Playwright pass over the demo workspace view for each tab: screenshot each one, capture console and page errors, and check that buttons respond.
- Call the health-kayla-notes, health-pilot-dictation, health-access and BOOST functions without signing in and expect them to refuse; check their recent logs.
- Fixes stay in the presentation/front-end code unless a server error is found. Database changes, if any are needed, will be shown to you before they are applied.
