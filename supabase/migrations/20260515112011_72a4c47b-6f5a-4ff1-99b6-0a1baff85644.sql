ALTER TABLE public.kayla_run_log
  ADD COLUMN IF NOT EXISTS input_tokens integer,
  ADD COLUMN IF NOT EXISTS output_tokens integer,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS cost_usd numeric(10,6);

CREATE INDEX IF NOT EXISTS idx_kayla_run_log_agent_started ON public.kayla_run_log(agent_name, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_kayla_run_log_started ON public.kayla_run_log(started_at DESC);

CREATE TABLE IF NOT EXISTS public.kayla_cost_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL UNIQUE,
  daily_cap_usd numeric(10,2) NOT NULL DEFAULT 5.00,
  monthly_cap_usd numeric(10,2) NOT NULL DEFAULT 100.00,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kayla_cost_thresholds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage cost thresholds" ON public.kayla_cost_thresholds;
CREATE POLICY "Admins manage cost thresholds" ON public.kayla_cost_thresholds
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));