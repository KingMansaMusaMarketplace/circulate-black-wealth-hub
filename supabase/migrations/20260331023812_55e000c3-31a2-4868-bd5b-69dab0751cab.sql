
-- Credit & Lending Readiness Reports (Service #20)
CREATE TABLE public.credit_readiness_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Scores
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  financial_health_score INTEGER CHECK (financial_health_score >= 0 AND financial_health_score <= 100),
  documentation_score INTEGER CHECK (documentation_score >= 0 AND documentation_score <= 100),
  credit_profile_score INTEGER CHECK (credit_profile_score >= 0 AND credit_profile_score <= 100),
  
  -- Financial metrics
  monthly_revenue NUMERIC DEFAULT 0,
  monthly_expenses NUMERIC DEFAULT 0,
  debt_to_income_ratio NUMERIC,
  profit_margin NUMERIC,
  months_in_business INTEGER,
  
  -- AI-generated content
  executive_summary TEXT,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  loan_types_qualified JSONB DEFAULT '[]'::jsonb,
  estimated_borrowing_range JSONB DEFAULT '{}'::jsonb,
  
  -- Package status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'complete', 'error')),
  error_message TEXT,
  
  -- Source data references
  investment_readiness_data JSONB,
  cashflow_data JSONB,
  documents_included JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.credit_readiness_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business owners can manage their credit reports"
  ON public.credit_readiness_reports
  FOR ALL
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT id FROM public.businesses WHERE owner_id = auth.uid()
    )
  );

CREATE INDEX idx_credit_readiness_business ON public.credit_readiness_reports(business_id);
CREATE INDEX idx_credit_readiness_status ON public.credit_readiness_reports(status);
