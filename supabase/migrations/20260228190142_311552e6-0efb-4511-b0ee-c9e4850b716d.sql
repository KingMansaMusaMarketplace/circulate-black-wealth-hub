
-- Smart Pricing Recommendations table
CREATE TABLE public.pricing_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.vacation_properties(id) ON DELETE CASCADE,
  host_id UUID NOT NULL,
  
  -- Current vs recommended
  current_nightly_rate NUMERIC NOT NULL,
  recommended_nightly_rate NUMERIC NOT NULL,
  confidence_score NUMERIC NOT NULL DEFAULT 0.5,
  
  -- Factors
  reason TEXT NOT NULL,
  factors JSONB DEFAULT '{}',
  
  -- Date range this recommendation applies to
  applies_from DATE NOT NULL,
  applies_to DATE NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'dismissed', 'expired')),
  accepted_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_recommendations ENABLE ROW LEVEL SECURITY;

-- Hosts can view their own recommendations
CREATE POLICY "Hosts can view own pricing recommendations"
  ON public.pricing_recommendations FOR SELECT
  USING (auth.uid() = host_id);

-- Hosts can update their own recommendations (accept/dismiss)
CREATE POLICY "Hosts can update own pricing recommendations"
  ON public.pricing_recommendations FOR UPDATE
  USING (auth.uid() = host_id);

-- System can insert recommendations (via edge function with service role)
CREATE POLICY "Service role can insert pricing recommendations"
  ON public.pricing_recommendations FOR INSERT
  WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_pricing_recommendations_property ON public.pricing_recommendations(property_id, status);
CREATE INDEX idx_pricing_recommendations_host ON public.pricing_recommendations(host_id, status);
