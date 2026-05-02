-- One-row-per-business "First Look" baseline produced by kayla-first-touch
CREATE TABLE IF NOT EXISTS public.kayla_business_baseline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL UNIQUE,
  industry text,
  size_estimate text,
  public_sentiment text,
  top_grants jsonb NOT NULL DEFAULT '[]'::jsonb,
  compliance_gaps jsonb NOT NULL DEFAULT '[]'::jsonb,
  certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  welcome_message text,
  raw_insights jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kayla_baseline_business ON public.kayla_business_baseline(business_id);

ALTER TABLE public.kayla_business_baseline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their baseline"
ON public.kayla_business_baseline
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = kayla_business_baseline.business_id
      AND (b.owner_id = auth.uid() OR b.location_manager_id = auth.uid())
  )
);

CREATE POLICY "Service role manages baselines"
ON public.kayla_business_baseline
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE TRIGGER update_kayla_baseline_updated_at
BEFORE UPDATE ON public.kayla_business_baseline
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();