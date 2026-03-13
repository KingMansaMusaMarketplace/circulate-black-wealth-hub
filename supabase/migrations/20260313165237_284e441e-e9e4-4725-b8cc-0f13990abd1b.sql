-- Kayla Adaptive Learning: Outcome Feedback Table
CREATE TABLE public.kayla_outcome_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.kayla_agent_reports(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_id TEXT,
  target_type TEXT,
  outcome TEXT NOT NULL DEFAULT 'pending',
  feedback_source TEXT DEFAULT 'system',
  feedback_notes TEXT,
  original_content TEXT,
  modified_content TEXT,
  confidence_score NUMERIC(3,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID
);

ALTER TABLE public.kayla_outcome_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage outcome feedback"
  ON public.kayla_outcome_feedback FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_kayla_outcome_service ON public.kayla_outcome_feedback(service_type);
CREATE INDEX idx_kayla_outcome_outcome ON public.kayla_outcome_feedback(outcome);
CREATE INDEX idx_kayla_outcome_created ON public.kayla_outcome_feedback(created_at DESC);

-- Kayla Performance Metrics: Aggregated stats per service
CREATE TABLE public.kayla_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  total_actions INTEGER NOT NULL DEFAULT 0,
  accepted_count INTEGER NOT NULL DEFAULT 0,
  rejected_count INTEGER NOT NULL DEFAULT 0,
  modified_count INTEGER NOT NULL DEFAULT 0,
  ignored_count INTEGER NOT NULL DEFAULT 0,
  avg_confidence NUMERIC(3,2),
  success_rate NUMERIC(5,2),
  improvement_from_previous NUMERIC(5,2),
  top_patterns JSONB,
  learned_adjustments JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.kayla_performance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view performance metrics"
  ON public.kayla_performance_metrics FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_kayla_perf_service ON public.kayla_performance_metrics(service_type);
CREATE INDEX idx_kayla_perf_period ON public.kayla_performance_metrics(period_start DESC);

-- Kayla Learning Signals: Learned patterns
CREATE TABLE public.kayla_learning_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  signal_key TEXT NOT NULL,
  signal_value JSONB NOT NULL,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.50,
  sample_count INTEGER NOT NULL DEFAULT 1,
  last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(service_type, signal_type, signal_key)
);

ALTER TABLE public.kayla_learning_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage learning signals"
  ON public.kayla_learning_signals FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_kayla_signals_service ON public.kayla_learning_signals(service_type);
CREATE INDEX idx_kayla_signals_confidence ON public.kayla_learning_signals(confidence DESC);

-- Trigger: auto-track review draft outcomes
CREATE OR REPLACE FUNCTION public.track_review_draft_outcome()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('approved', 'rejected') THEN
    INSERT INTO public.kayla_outcome_feedback (
      service_type, action_type, target_id, target_type,
      outcome, feedback_source, original_content,
      resolved_at, resolved_by
    ) VALUES (
      'reviews', 'draft_response', NEW.review_id, 'review',
      CASE WHEN NEW.status = 'approved' THEN 'accepted' ELSE 'rejected' END,
      'business_owner', NEW.draft_response,
      now(), NEW.approved_by
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trigger_track_review_draft_outcome
  AFTER UPDATE ON public.kayla_review_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.track_review_draft_outcome();

-- Trigger: auto-track generated content outcomes
CREATE OR REPLACE FUNCTION public.track_content_outcome()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('published', 'rejected') THEN
    INSERT INTO public.kayla_outcome_feedback (
      service_type, action_type, target_id, target_type,
      outcome, feedback_source, original_content,
      resolved_at
    ) VALUES (
      'content', 'social_post', NEW.id, 'content',
      CASE WHEN NEW.status = 'published' THEN 'accepted' ELSE 'rejected' END,
      'business_owner', NEW.content,
      now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trigger_track_content_outcome
  AFTER UPDATE ON public.kayla_generated_content
  FOR EACH ROW
  EXECUTE FUNCTION public.track_content_outcome();

-- Trigger: auto-track B2B match outcomes
CREATE OR REPLACE FUNCTION public.track_b2b_match_outcome()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('accepted', 'rejected', 'connected') THEN
    INSERT INTO public.kayla_outcome_feedback (
      service_type, action_type, target_id, target_type,
      outcome, feedback_source, confidence_score,
      resolved_at
    ) VALUES (
      'matchmaker', 'b2b_match', NEW.id, 'b2b_match',
      CASE WHEN NEW.status IN ('accepted', 'connected') THEN 'accepted' ELSE 'rejected' END,
      'business_owner', NEW.match_score,
      now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trigger_track_b2b_match_outcome
  AFTER UPDATE ON public.kayla_b2b_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.track_b2b_match_outcome();