CREATE TABLE public.hc_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  organization text NOT NULL,
  role text NOT NULL,
  work_email text NOT NULL,
  phone text,
  status text NOT NULL DEFAULT 'pending',
  decision_token text NOT NULL DEFAULT encode(gen_random_bytes(24),'hex'),
  access_token text,
  nda_accepted_at timestamptz NOT NULL DEFAULT now(),
  user_agent text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.hc_access_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.hc_access_requests(id) ON DELETE CASCADE,
  path text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.hc_access_requests TO service_role;
GRANT ALL ON public.hc_access_views TO service_role;
GRANT SELECT ON public.hc_access_requests TO authenticated;
GRANT SELECT ON public.hc_access_views TO authenticated;
ALTER TABLE public.hc_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hc_access_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read access requests" ON public.hc_access_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins read access views" ON public.hc_access_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX ON public.hc_access_requests(access_token);
CREATE INDEX ON public.hc_access_views(request_id);