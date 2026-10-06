CREATE TABLE IF NOT EXISTS public.kayla_improvement_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_result_id UUID UNIQUE REFERENCES public.kayla_benchmark_results(id) ON DELETE SET NULL,
  run_id UUID REFERENCES public.kayla_benchmark_runs(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  weak_answer TEXT,
  score INTEGER,
  grader_notes TEXT,
  diagnosis TEXT,
  proposed_rule TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.kayla_improvement_proposals TO authenticated;
GRANT ALL ON public.kayla_improvement_proposals TO service_role;
ALTER TABLE public.kayla_improvement_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read improvement proposals"
  ON public.kayla_improvement_proposals FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins review improvement proposals"
  ON public.kayla_improvement_proposals FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_kayla_improvement_status ON public.kayla_improvement_proposals(status, created_at DESC);

-- Weekly schedule (Mondays 08:00 UTC), reusing the existing nightly job's auth header.
DO $$
DECLARE tmpl TEXT;
BEGIN
  SELECT command INTO tmpl FROM cron.job WHERE jobname = 'kayla-data-agent-daily' LIMIT 1;
  IF tmpl IS NULL THEN RAISE NOTICE 'template job not found; skipping schedule'; RETURN; END IF;
  PERFORM cron.unschedule('kayla-weekly-improvement')
  WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'kayla-weekly-improvement');
  PERFORM cron.schedule('kayla-weekly-improvement', '0 8 * * 1',
    replace(tmpl, 'kayla-data-agent', 'kayla-weekly-improvement'));
END $$;