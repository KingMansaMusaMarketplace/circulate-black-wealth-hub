
CREATE TABLE IF NOT EXISTS public.daily_ops_digests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_date date NOT NULL UNIQUE,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  sentry_summary jsonb DEFAULT '{}'::jsonb,
  posthog_summary jsonb DEFAULT '{}'::jsonb,
  email_sent_to text,
  email_status text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_ops_digests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view digests"
  ON public.daily_ops_digests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_daily_ops_digests_date ON public.daily_ops_digests(digest_date DESC);
