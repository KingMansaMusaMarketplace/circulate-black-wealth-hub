
-- =====================================================
-- 1. ADD SERVICE TIER TO VACATION PROPERTIES
-- =====================================================
ALTER TABLE public.vacation_properties
  ADD COLUMN IF NOT EXISTS service_tier text NOT NULL DEFAULT 'basic'
    CHECK (service_tier IN ('basic', 'premium'));

-- Add index for tier-based queries
CREATE INDEX IF NOT EXISTS idx_vacation_properties_service_tier 
  ON public.vacation_properties(service_tier);

-- =====================================================
-- 2. NON-BIAS CERTIFICATION TABLE
-- =====================================================
CREATE TABLE public.non_bias_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Training progress
  training_module_1_completed BOOLEAN DEFAULT false,  -- Understanding Bias
  training_module_2_completed BOOLEAN DEFAULT false,  -- Inclusive Hosting Practices
  training_module_3_completed BOOLEAN DEFAULT false,  -- Community Standards
  training_completed_at TIMESTAMPTZ,
  
  -- Pledge
  pledge_accepted BOOLEAN DEFAULT false,
  pledge_accepted_at TIMESTAMPTZ,
  pledge_text TEXT,
  
  -- Certification status
  status TEXT NOT NULL DEFAULT 'not_started' 
    CHECK (status IN ('not_started', 'in_progress', 'training_complete', 'certified', 'revoked')),
  certified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(host_id)
);

-- Enable RLS
ALTER TABLE public.non_bias_certifications ENABLE ROW LEVEL SECURITY;

-- Hosts can view their own certification
CREATE POLICY "Hosts can view own certification"
  ON public.non_bias_certifications FOR SELECT
  TO authenticated
  USING (host_id = auth.uid());

-- Anyone can view certified hosts (for badges)
CREATE POLICY "Anyone can view certified hosts"
  ON public.non_bias_certifications FOR SELECT
  USING (status = 'certified');

-- Hosts can create their own certification record
CREATE POLICY "Hosts can create own certification"
  ON public.non_bias_certifications FOR INSERT
  TO authenticated
  WITH CHECK (host_id = auth.uid());

-- Hosts can update their own certification
CREATE POLICY "Hosts can update own certification"
  ON public.non_bias_certifications FOR UPDATE
  TO authenticated
  USING (host_id = auth.uid())
  WITH CHECK (host_id = auth.uid());

-- Index
CREATE INDEX idx_non_bias_certifications_host ON public.non_bias_certifications(host_id);
CREATE INDEX idx_non_bias_certifications_status ON public.non_bias_certifications(status) WHERE status = 'certified';

-- Auto-update timestamp trigger
CREATE TRIGGER update_non_bias_certifications_updated_at
  BEFORE UPDATE ON public.non_bias_certifications
  FOR EACH ROW EXECUTE FUNCTION public.update_vacation_updated_at();
