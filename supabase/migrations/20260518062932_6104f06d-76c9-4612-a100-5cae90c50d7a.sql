-- ============================================================
-- 1. LISTING STATUS (Host Approval Gate)
-- ============================================================
CREATE TYPE public.listing_status_enum AS ENUM ('draft', 'pending_review', 'approved', 'rejected');

ALTER TABLE public.vacation_properties
  ADD COLUMN IF NOT EXISTS listing_status public.listing_status_enum NOT NULL DEFAULT 'pending_review',
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID;

-- Backfill: anything already in the DB is auto-approved so we don't break the live site
UPDATE public.vacation_properties SET listing_status = 'approved' WHERE listing_status = 'pending_review';

CREATE INDEX IF NOT EXISTS idx_vacation_properties_listing_status ON public.vacation_properties(listing_status);

-- ============================================================
-- 2. LEASE AGREEMENT REFUND TRACKING
-- ============================================================
ALTER TABLE public.lease_agreements
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_refund_id TEXT;

CREATE INDEX IF NOT EXISTS idx_lease_agreements_refund_due
  ON public.lease_agreements(cancelled_at)
  WHERE cancelled_at IS NOT NULL AND refunded_at IS NULL;

-- ============================================================
-- 3. LEGAL ACCEPTANCES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.legal_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  document_version TEXT NOT NULL DEFAULT 'v1',
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  context JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_legal_acceptances_user ON public.legal_acceptances(user_id, document_type);

ALTER TABLE public.legal_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own legal acceptances"
  ON public.legal_acceptances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record their own legal acceptances"
  ON public.legal_acceptances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all legal acceptances"
  ON public.legal_acceptances FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- 4. HOST IDENTITY VERIFICATION
-- ============================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS identity_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS identity_session_id TEXT,
  ADD COLUMN IF NOT EXISTS identity_status TEXT;

-- ============================================================
-- 5. HOST APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.host_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  state TEXT,
  property_type TEXT,
  listing_mode TEXT,
  estimated_units INTEGER,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_host_applications_status ON public.host_applications(status, created_at DESC);

ALTER TABLE public.host_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a host application"
  ON public.host_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own host applications"
  ON public.host_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all host applications"
  ON public.host_applications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update host applications"
  ON public.host_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    EXECUTE 'CREATE TRIGGER trg_host_applications_updated_at
      BEFORE UPDATE ON public.host_applications
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()';
  END IF;
END $$;