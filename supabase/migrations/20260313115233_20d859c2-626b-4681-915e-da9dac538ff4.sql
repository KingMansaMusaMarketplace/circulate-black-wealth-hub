
-- Kayla autonomous agent audit reports
CREATE TABLE public.kayla_agent_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL DEFAULT 'data_quality_audit',
  status TEXT NOT NULL DEFAULT 'completed',
  summary TEXT NOT NULL,
  issues_found INTEGER NOT NULL DEFAULT 0,
  issues_fixed INTEGER NOT NULL DEFAULT 0,
  issues_requiring_review INTEGER NOT NULL DEFAULT 0,
  details JSONB DEFAULT '[]'::jsonb,
  actions_taken JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE public.kayla_agent_reports ENABLE ROW LEVEL SECURITY;

-- Only admins can read reports
CREATE POLICY "Admins can view agent reports"
  ON public.kayla_agent_reports
  FOR SELECT
  TO authenticated
  USING (public.is_admin_secure());

-- Service role inserts (from Edge Function)
CREATE POLICY "Service role can insert agent reports"
  ON public.kayla_agent_reports
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Admins can update (mark as reviewed)
CREATE POLICY "Admins can update agent reports"
  ON public.kayla_agent_reports
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_secure());

-- Index for quick lookups
CREATE INDEX idx_kayla_agent_reports_created ON public.kayla_agent_reports(created_at DESC);
CREATE INDEX idx_kayla_agent_reports_type ON public.kayla_agent_reports(report_type);
