ALTER TABLE public.fraud_alerts 
  ADD COLUMN IF NOT EXISTS primary_model TEXT DEFAULT 'gemini-3-flash',
  ADD COLUMN IF NOT EXISTS secondary_model TEXT,
  ADD COLUMN IF NOT EXISTS secondary_model_assessment JSONB,
  ADD COLUMN IF NOT EXISTS secondary_confidence_score NUMERIC,
  ADD COLUMN IF NOT EXISTS model_agreement BOOLEAN,
  ADD COLUMN IF NOT EXISTS consensus_score NUMERIC,
  ADD COLUMN IF NOT EXISTS consensus_reviewed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_fraud_alerts_consensus_pending 
  ON public.fraud_alerts (severity, model_agreement) 
  WHERE consensus_score IS NULL AND severity IN ('critical', 'high');

COMMENT ON COLUMN public.fraud_alerts.consensus_score IS 'Combined confidence from multi-model analysis (0-1). NULL = not yet reviewed by second model.';
COMMENT ON COLUMN public.fraud_alerts.model_agreement IS 'Whether primary and secondary models agree on the alert validity.';