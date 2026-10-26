CREATE TABLE public.os_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  company text NOT NULL,
  role text,
  email text NOT NULL,
  phone text,
  status text NOT NULL DEFAULT 'pending',
  access_token_hash text,
  decided_at timestamptz,
  viewing_started_at timestamptz,
  viewing_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.os_access_requests TO authenticated;
GRANT ALL ON public.os_access_requests TO service_role;
ALTER TABLE public.os_access_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view OS walkthrough requests" ON public.os_access_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX os_access_requests_created_idx ON public.os_access_requests (created_at DESC);
CREATE UNIQUE INDEX os_access_requests_token_idx ON public.os_access_requests (access_token_hash) WHERE access_token_hash IS NOT NULL;