
-- ============================================================
-- NOIRE RIDESHARE — DRIVER VETTING (PHASE 1)
-- ============================================================

-- 1) ENUMS
DO $$ BEGIN
  CREATE TYPE public.noir_driver_application_status AS ENUM
    ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.noir_driver_document_type AS ENUM (
    'license_front', 'license_back', 'selfie',
    'insurance', 'registration',
    'vehicle_front', 'vehicle_back', 'vehicle_left', 'vehicle_right', 'vehicle_interior',
    'w9', 'vehicle_inspection'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.noir_document_review_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) EXTEND noir_drivers
ALTER TABLE public.noir_drivers
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS address_line1 text,
  ADD COLUMN IF NOT EXISTS address_city text,
  ADD COLUMN IF NOT EXISTS address_state text,
  ADD COLUMN IF NOT EXISTS address_zip text,
  ADD COLUMN IF NOT EXISTS drivers_license_state text,
  ADD COLUMN IF NOT EXISTS drivers_license_expires_at date,
  ADD COLUMN IF NOT EXISTS vehicle_vin text,
  ADD COLUMN IF NOT EXISTS vehicle_registration_expires_at date,
  ADD COLUMN IF NOT EXISTS insurance_policy_number text,
  ADD COLUMN IF NOT EXISTS insurance_expires_at date,
  ADD COLUMN IF NOT EXISTS application_status public.noir_driver_application_status NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS agreement_accepted_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_noir_drivers_application_status
  ON public.noir_drivers(application_status);

-- 3) DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.noir_driver_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES public.noir_drivers(id) ON DELETE CASCADE,
  document_type public.noir_driver_document_type NOT NULL,
  file_url text NOT NULL,
  file_path text,
  expires_at date,
  review_status public.noir_document_review_status NOT NULL DEFAULT 'pending',
  reviewer_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_noir_driver_documents_driver
  ON public.noir_driver_documents(driver_id);
CREATE INDEX IF NOT EXISTS idx_noir_driver_documents_status
  ON public.noir_driver_documents(review_status);

ALTER TABLE public.noir_driver_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Drivers view own documents" ON public.noir_driver_documents;
CREATE POLICY "Drivers view own documents"
  ON public.noir_driver_documents FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.noir_drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Drivers insert own documents" ON public.noir_driver_documents;
CREATE POLICY "Drivers insert own documents"
  ON public.noir_driver_documents FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.noir_drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Drivers update own pending docs" ON public.noir_driver_documents;
CREATE POLICY "Drivers update own pending docs"
  ON public.noir_driver_documents FOR UPDATE
  USING (
    (EXISTS (SELECT 1 FROM public.noir_drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
      AND review_status = 'pending')
    OR public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "Drivers delete own pending docs" ON public.noir_driver_documents;
CREATE POLICY "Drivers delete own pending docs"
  ON public.noir_driver_documents FOR DELETE
  USING (
    (EXISTS (SELECT 1 FROM public.noir_drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
      AND review_status = 'pending')
    OR public.has_role(auth.uid(), 'admin')
  );

-- 4) STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.noir_driver_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES public.noir_drivers(id) ON DELETE CASCADE,
  from_status public.noir_driver_application_status,
  to_status public.noir_driver_application_status NOT NULL,
  changed_by uuid,
  reason text,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_noir_driver_status_history_driver
  ON public.noir_driver_status_history(driver_id, changed_at DESC);

ALTER TABLE public.noir_driver_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Drivers view own history" ON public.noir_driver_status_history;
CREATE POLICY "Drivers view own history"
  ON public.noir_driver_status_history FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.noir_drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

-- No direct INSERT/UPDATE/DELETE policies; only the trigger or admin RPC writes here.

-- 5) AUTO-LOG STATUS CHANGES VIA TRIGGER
CREATE OR REPLACE FUNCTION public.log_noir_driver_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.noir_driver_status_history(driver_id, from_status, to_status, changed_by, reason)
    VALUES (NEW.id, NULL, NEW.application_status, auth.uid(), 'Application created');
  ELSIF (NEW.application_status IS DISTINCT FROM OLD.application_status) THEN
    INSERT INTO public.noir_driver_status_history(driver_id, from_status, to_status, changed_by, reason)
    VALUES (NEW.id, OLD.application_status, NEW.application_status, auth.uid(), NEW.rejection_reason);
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_log_noir_driver_status ON public.noir_drivers;
CREATE TRIGGER trg_log_noir_driver_status
  AFTER INSERT OR UPDATE OF application_status
  ON public.noir_drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.log_noir_driver_status_change();

-- 6) updated_at trigger for documents
DROP TRIGGER IF EXISTS trg_noir_driver_documents_updated ON public.noir_driver_documents;
CREATE TRIGGER trg_noir_driver_documents_updated
  BEFORE UPDATE ON public.noir_driver_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 7) ADMIN STATUS-CHANGE RPC (with reason)
CREATE OR REPLACE FUNCTION public.admin_update_noir_driver_status(
  p_driver_id uuid,
  p_new_status public.noir_driver_application_status,
  p_reason text DEFAULT NULL,
  p_admin_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can change driver application status';
  END IF;

  UPDATE public.noir_drivers
  SET application_status = p_new_status,
      rejection_reason = CASE WHEN p_new_status IN ('rejected','suspended') THEN p_reason ELSE rejection_reason END,
      admin_notes = COALESCE(p_admin_notes, admin_notes),
      reviewed_at = CASE WHEN p_new_status IN ('approved','rejected','suspended','under_review') THEN now() ELSE reviewed_at END,
      reviewed_by = CASE WHEN p_new_status IN ('approved','rejected','suspended','under_review') THEN auth.uid() ELSE reviewed_by END,
      is_approved = CASE WHEN p_new_status = 'approved' THEN true
                         WHEN p_new_status IN ('rejected','suspended') THEN false
                         ELSE is_approved END,
      is_active   = CASE WHEN p_new_status = 'suspended' THEN false ELSE is_active END,
      updated_at = now()
  WHERE id = p_driver_id;

  RETURN FOUND;
END $$;

-- 8) STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('noir-driver-documents', 'noir-driver-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: driver folder = their user id
DROP POLICY IF EXISTS "Driver can read own docs" ON storage.objects;
CREATE POLICY "Driver can read own docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'noir-driver-documents'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
  );

DROP POLICY IF EXISTS "Driver can upload own docs" ON storage.objects;
CREATE POLICY "Driver can upload own docs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'noir-driver-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Driver can update own docs" ON storage.objects;
CREATE POLICY "Driver can update own docs"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'noir-driver-documents'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
  );

DROP POLICY IF EXISTS "Driver can delete own docs" ON storage.objects;
CREATE POLICY "Driver can delete own docs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'noir-driver-documents'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
  );
