
CREATE TABLE public.investor_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  firm text NOT NULL,
  title text,
  aum text,
  linkedin_url text,
  reason text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','denied')),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  admin_notes text,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.investor_access_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.investor_access_requests TO authenticated;
GRANT ALL ON public.investor_access_requests TO service_role;

ALTER TABLE public.investor_access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an investor access request"
  ON public.investor_access_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all investor access requests"
  ON public.investor_access_requests
  FOR SELECT
  TO authenticated
  USING (public.is_admin_secure());

CREATE POLICY "Admins can update investor access requests"
  ON public.investor_access_requests
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_secure())
  WITH CHECK (public.is_admin_secure());

CREATE POLICY "Admins can delete investor access requests"
  ON public.investor_access_requests
  FOR DELETE
  TO authenticated
  USING (public.is_admin_secure());

CREATE INDEX idx_investor_access_requests_status ON public.investor_access_requests(status, created_at DESC);
