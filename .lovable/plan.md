# Phase 1 — Noire Rideshare Driver Vetting

Goal: Give admins everything they need to verify a driver before letting them pick up riders. No external background-check API yet — that's Phase 2.

## What's already in place

The `noir_drivers` table exists with basic info (name, phone, vehicle, license number, approval flag). It is missing: document storage, structured status pipeline, expiration tracking, audit history.

## What this phase adds

### 1. Database (one migration)

**Extend `noir_drivers`** with vetting fields:
- `date_of_birth`, `address_line1`, `address_city`, `address_state`, `address_zip`
- `drivers_license_state`, `drivers_license_expires_at`
- `vehicle_vin`, `vehicle_registration_expires_at`, `insurance_policy_number`, `insurance_expires_at`
- `application_status` — enum: `draft`, `submitted`, `under_review`, `approved`, `rejected`, `suspended`
- `submitted_at`, `reviewed_at`, `reviewed_by`, `rejection_reason`, `admin_notes`
- `agreement_accepted_at` (driver TOS)

**New table `noir_driver_documents`** — one row per uploaded file:
- `driver_id`, `document_type` (license_front, license_back, selfie, insurance, registration, vehicle_photo_front/back/left/right/interior, w9, vehicle_inspection)
- `file_url`, `uploaded_at`, `expires_at` (nullable)
- `review_status` (pending/approved/rejected), `reviewer_notes`, `reviewed_by`, `reviewed_at`

**New table `noir_driver_status_history`** — audit trail:
- `driver_id`, `from_status`, `to_status`, `changed_by`, `reason`, `changed_at`

**Storage bucket `noir-driver-documents`** — private, RLS so drivers only see their own and admins see all.

**RLS**: drivers read/write their own row + own documents; admins (via `has_role`) read/write everything.

### 2. Driver-facing UI

New page **`/noir/drive/apply`** (multi-step form):
1. Personal info (name, DOB, address, phone)
2. Driver's license (number, state, expiration, upload front + back + selfie)
3. Vehicle (make/model/year/color/VIN/plate, upload 4 exterior photos + interior)
4. Insurance & registration (policy #, expiration, upload both PDFs)
5. Agreement checkbox + submit → status becomes `submitted`

Driver dashboard shows current status with clear next steps ("3 documents pending review", "Insurance expires in 14 days — please re-upload").

### 3. Admin UI (extends existing Admin → Noire Rideshare → Drivers tab)

- **Applications queue** with filter chips: Submitted / Under Review / Approved / Rejected / Suspended
- **Driver detail drawer**: all info + all documents in a grid with image preview + per-document approve/reject buttons
- **Action buttons**: Approve Driver / Reject (with reason picker + custom text) / Suspend / Reactivate / Add Note
- **Status history timeline** at the bottom of the drawer
- **Expiration warnings**: badges when license/insurance/registration are within 30 days

### 4. Notifications

When a driver's status changes, send a branded email via the existing `send-transactional-email` edge function:
- Submitted → "We've received your application"
- Approved → "Welcome to Noire — you're cleared to drive"
- Rejected → reason included + how to re-apply
- Suspended → reason + contact support
- Document rejected → "Please re-upload [document name]"

### 5. End-to-end test

A migration-based test (same pattern as the Stays beta + Noire ride test) that:
1. Creates a test driver application with documents
2. Walks it through submitted → under_review → approved
3. Verifies the status history rows
4. Cleans up

## Out of scope (Phase 2 / 3)

- Checkr / Sterling background check API
- DMV motor vehicle record pulls
- Automatic re-verification reminders via email scheduler
- City permit verification (Chicago TNP)
- W-9 / 1099 tax form auto-generation

## Files to be created

- `supabase/migrations/<timestamp>_noir_driver_vetting.sql`
- `src/pages/noir/DriverApplyPage.tsx`
- `src/components/noir/driver-apply/` — 5 step components + a `DocumentUploader` shared component
- `src/components/admin/noir/DriverApplicationsQueue.tsx`
- `src/components/admin/noir/DriverDetailDrawer.tsx`
- `src/components/admin/noir/DriverDocumentReview.tsx`
- `src/components/admin/noir/DriverStatusHistory.tsx`
- `src/hooks/useDriverApplication.ts`
- `src/lib/api/noir-driver-api.ts`
- `supabase/migrations/<timestamp>_noir_driver_vetting_e2e_test.sql`

## Files to be edited

- `src/App.tsx` — add `/noir/drive/apply` route
- The existing Noire admin tab — wire in the new applications queue
- `src/integrations/supabase/types.ts` — regenerated automatically after migration

## Your next steps (no jargon)

1. Approve this plan — I'll build it.
2. After it's live, go to **Admin → Noire Rideshare → Drivers** and you'll see a new "Applications" tab.
3. Test the full flow by signing up as a driver at `/noir/drive/apply`, uploading sample docs, then approving yourself from the admin side.
4. Talk to a lawyer + insurance broker about Illinois rideshare requirements before letting real strangers drive (separate from the code).
