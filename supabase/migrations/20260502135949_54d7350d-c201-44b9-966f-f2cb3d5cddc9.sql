-- Idempotency lock for kayla agent runs (used by auto-discover early-exit)
CREATE TABLE IF NOT EXISTS public.kayla_run_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  run_status text NOT NULL DEFAULT 'started', -- started | completed | failed | skipped
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  duration_ms integer,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_kayla_run_log_agent_completed ON public.kayla_run_log (agent_name, completed_at DESC);
ALTER TABLE public.kayla_run_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view kayla run log"
  ON public.kayla_run_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Service role bypasses RLS automatically; no insert policy needed for cron-invoked functions.

-- Feedback writes from Kayla agents (top-8 agents will write here after each material decision)
CREATE TABLE IF NOT EXISTS public.ai_agent_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  business_id uuid,
  user_id uuid,
  decision_type text NOT NULL,         -- e.g. 'lead_score', 'churn_pred', 'price_suggestion'
  decision_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  outcome text,                        -- 'accepted' | 'rejected' | 'unknown' | 'auto'
  outcome_value numeric,               -- optional measured value (e.g. revenue lift)
  rating smallint,                     -- -1 / 0 / +1 thumbs
  feedback_text text,
  model_used text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ai_agent_feedback_agent_created ON public.ai_agent_feedback (agent_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_agent_feedback_business ON public.ai_agent_feedback (business_id, created_at DESC);
ALTER TABLE public.ai_agent_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all agent feedback"
  ON public.ai_agent_feedback FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Business owners can view their own agent feedback"
  ON public.ai_agent_feedback FOR SELECT TO authenticated
  USING (
    business_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.businesses b WHERE b.id = ai_agent_feedback.business_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can rate their own agent feedback"
  ON public.ai_agent_feedback FOR UPDATE TO authenticated
  USING (
    user_id = auth.uid() OR (
      business_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.businesses b WHERE b.id = ai_agent_feedback.business_id AND b.owner_id = auth.uid()
      )
    )
  )
  WITH CHECK (true);

-- Service-role-callable RPC that agents use to log decisions safely
CREATE OR REPLACE FUNCTION public.log_agent_decision(
  _agent_name text,
  _business_id uuid,
  _user_id uuid,
  _decision_type text,
  _decision_payload jsonb,
  _model_used text DEFAULT NULL,
  _outcome text DEFAULT 'auto'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO public.ai_agent_feedback (
    agent_name, business_id, user_id, decision_type, decision_payload, model_used, outcome
  ) VALUES (
    _agent_name, _business_id, _user_id, _decision_type, _decision_payload, _model_used, _outcome
  ) RETURNING id INTO new_id;
  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.log_agent_decision(text, uuid, uuid, text, jsonb, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_agent_decision(text, uuid, uuid, text, jsonb, text, text) TO service_role, authenticated;