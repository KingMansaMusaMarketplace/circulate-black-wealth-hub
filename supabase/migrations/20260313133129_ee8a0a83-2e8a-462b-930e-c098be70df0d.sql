
CREATE TABLE public.kayla_health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_type TEXT NOT NULL DEFAULT 'scheduled',
  overall_status TEXT NOT NULL DEFAULT 'pending',
  checks JSONB NOT NULL DEFAULT '[]'::jsonb,
  passed_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  warning_count INTEGER NOT NULL DEFAULT 0,
  total_checks INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.kayla_health_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage health checks"
  ON public.kayla_health_checks
  FOR ALL
  TO authenticated
  USING (public.is_admin_secure());
