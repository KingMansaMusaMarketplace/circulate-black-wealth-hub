
-- Enum for submission status
DO $$ BEGIN
  CREATE TYPE public.business_submission_status AS ENUM (
    'pending_verification',
    'pending_review',
    'approved',
    'rejected',
    'needs_more_info'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE public.business_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  website text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  owner_name text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  category text NOT NULL,
  attests_ownership boolean NOT NULL DEFAULT false,
  attests_black_owned boolean NOT NULL DEFAULT false,
  attested_at timestamptz NOT NULL DEFAULT now(),
  submitter_ip text,
  submitter_user_agent text,
  status public.business_submission_status NOT NULL DEFAULT 'pending_verification',
  kayla_report jsonb,
  confidence_score integer,
  admin_notes text,
  approved_business_id uuid REFERENCES public.businesses(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_submissions_status ON public.business_submissions(status);
CREATE INDEX idx_business_submissions_created_at ON public.business_submissions(created_at DESC);
CREATE INDEX idx_business_submissions_website ON public.business_submissions(lower(website));
CREATE INDEX idx_business_submissions_ip_recent ON public.business_submissions(submitter_ip, created_at DESC);

-- Grants (Data API access)
GRANT INSERT ON public.business_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.business_submissions TO authenticated;
GRANT ALL ON public.business_submissions TO service_role;

ALTER TABLE public.business_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit a business"
  ON public.business_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    attests_ownership = true
    AND attests_black_owned = true
    AND length(business_name) BETWEEN 2 AND 200
    AND length(website) BETWEEN 4 AND 500
    AND length(email) BETWEEN 5 AND 255
    AND length(phone) BETWEEN 7 AND 30
    AND length(owner_name) BETWEEN 2 AND 200
  );

-- Only admins can read submissions
CREATE POLICY "Admins can view submissions"
  ON public.business_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update submissions
CREATE POLICY "Admins can update submissions"
  ON public.business_submissions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete
CREATE POLICY "Admins can delete submissions"
  ON public.business_submissions
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- updated_at trigger
CREATE TRIGGER update_business_submissions_updated_at
  BEFORE UPDATE ON public.business_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
