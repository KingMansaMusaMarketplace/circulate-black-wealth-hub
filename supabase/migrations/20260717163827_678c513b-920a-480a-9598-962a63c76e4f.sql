
CREATE TABLE public.security_autopilot_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ran_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  triggered_by TEXT NOT NULL DEFAULT 'cron',
  triggered_by_user_id UUID,
  total_findings INTEGER NOT NULL DEFAULT 0,
  critical_count INTEGER NOT NULL DEFAULT 0,
  high_count INTEGER NOT NULL DEFAULT 0,
  medium_count INTEGER NOT NULL DEFAULT 0,
  low_count INTEGER NOT NULL DEFAULT 0,
  findings JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_error TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.security_autopilot_runs TO authenticated;
GRANT ALL ON public.security_autopilot_runs TO service_role;

ALTER TABLE public.security_autopilot_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view security autopilot runs"
  ON public.security_autopilot_runs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_security_autopilot_runs_ran_at
  ON public.security_autopilot_runs (ran_at DESC);

-- Schedule weekly scan: Mondays at 13:00 UTC (8am ET)
DO $$
BEGIN
  PERFORM cron.unschedule('security-autopilot-weekly');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

SELECT cron.schedule(
  'security-autopilot-weekly',
  '0 13 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/security-autopilot-scan',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', coalesce(current_setting('app.cron_secret', true), '')
    ),
    body := jsonb_build_object('trigger', 'cron')
  );
  $$
);
