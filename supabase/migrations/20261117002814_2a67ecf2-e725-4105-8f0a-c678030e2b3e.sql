-- Kayla Autopilot: daily/weekly self-checks and proof-gated auto-fixes.
CREATE TABLE IF NOT EXISTS public.kayla_autopilot_state (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled BOOLEAN NOT NULL DEFAULT true,
  paused_reason TEXT,
  paused_at TIMESTAMPTZ,
  lease_until TIMESTAMPTZ,
  last_daily_on DATE,
  last_weekly_on DATE,
  last_tick_at TIMESTAMPTZ,
  last_tick_note TEXT,
  last_email_at TIMESTAMPTZ,
  last_email_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.kayla_autopilot_state TO service_role;
ALTER TABLE public.kayla_autopilot_state ENABLE ROW LEVEL SECURITY;
INSERT INTO public.kayla_autopilot_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.kayla_benchmark_runs
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS case_ids UUID[],
  ADD COLUMN IF NOT EXISTS trial_rule TEXT,
  ADD COLUMN IF NOT EXISTS trial_proposal_id UUID,
  ADD COLUMN IF NOT EXISTS hops INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS autopilot_processed_at TIMESTAMPTZ;
DO $$ BEGIN
  ALTER TABLE public.kayla_benchmark_runs
    ADD CONSTRAINT kayla_benchmark_runs_kind_check CHECK (kind IN ('manual','daily','weekly','trial'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_kayla_runs_autopilot ON public.kayla_benchmark_runs(kind, autopilot_processed_at, started_at DESC);

ALTER TABLE public.kayla_improvement_proposals
  ADD COLUMN IF NOT EXISTS origin TEXT NOT NULL DEFAULT 'weekly',
  ADD COLUMN IF NOT EXISTS source_case_id UUID,
  ADD COLUMN IF NOT EXISTS autopilot_status TEXT,
  ADD COLUMN IF NOT EXISTS autopilot_note TEXT,
  ADD COLUMN IF NOT EXISTS trial_run_id UUID,
  ADD COLUMN IF NOT EXISTS auto_applied BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auto_applied_at TIMESTAMPTZ;
DO $$ BEGIN
  ALTER TABLE public.kayla_improvement_proposals
    ADD CONSTRAINT kayla_improvement_proposals_origin_check CHECK (origin IN ('weekly','autopilot'));
  ALTER TABLE public.kayla_improvement_proposals
    ADD CONSTRAINT kayla_improvement_proposals_autopilot_status_check
    CHECK (autopilot_status IS NULL OR autopilot_status IN ('trialing','kept','discarded','needs_approval','disabled','undone'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_kayla_proposals_autopilot ON public.kayla_improvement_proposals(origin, auto_applied_at DESC);