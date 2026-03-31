
-- Supplier Diversity Certifications tracking
CREATE TABLE public.supplier_diversity_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  certification_type TEXT NOT NULL, -- MBE, DBE, SDB, 8a, HUBZone, WOSB, SDVOSB, SBA, state_mbe, local_mbe
  certification_name TEXT NOT NULL,
  issuing_agency TEXT NOT NULL,
  certification_number TEXT,
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started, in_progress, submitted, active, expired, renewal_pending
  issued_date DATE,
  expiration_date DATE,
  renewal_deadline DATE,
  application_url TEXT,
  requirements_met JSONB DEFAULT '[]'::jsonb,
  documents_needed JSONB DEFAULT '[]'::jsonb,
  documents_uploaded JSONB DEFAULT '[]'::jsonb,
  ai_readiness_score NUMERIC(5,2) DEFAULT 0,
  ai_notes TEXT,
  naics_codes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contract opportunities pipeline
CREATE TABLE public.supplier_diversity_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  agency_name TEXT NOT NULL,
  contract_type TEXT NOT NULL, -- federal, state, local, corporate
  set_aside_type TEXT, -- 8a, small_business, minority, woman_owned, hubzone, sdvosb
  estimated_value_min NUMERIC(12,2),
  estimated_value_max NUMERIC(12,2),
  deadline DATE,
  solicitation_number TEXT,
  source_url TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'discovered', -- discovered, reviewing, preparing, submitted, awarded, lost
  match_score NUMERIC(5,2) DEFAULT 0,
  match_reasons JSONB DEFAULT '[]'::jsonb,
  naics_codes TEXT[] DEFAULT '{}',
  ai_summary TEXT,
  is_bookmarked BOOLEAN DEFAULT false,
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compliance & spend tracking for corporate programs
CREATE TABLE public.supplier_diversity_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  program_type TEXT NOT NULL, -- corporate, government, tier1, tier2
  sponsor_organization TEXT,
  total_contract_value NUMERIC(12,2) DEFAULT 0,
  spend_to_date NUMERIC(12,2) DEFAULT 0,
  spend_goal_percent NUMERIC(5,2),
  reporting_period TEXT, -- quarterly, annual
  next_report_due DATE,
  compliance_status TEXT DEFAULT 'on_track', -- on_track, at_risk, non_compliant, exceeding
  last_report_submitted_at TIMESTAMPTZ,
  ai_risk_assessment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.supplier_diversity_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_diversity_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_diversity_compliance ENABLE ROW LEVEL SECURITY;

-- RLS: business owners only
CREATE POLICY "Business owners manage certifications" ON public.supplier_diversity_certifications
  FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners manage opportunities" ON public.supplier_diversity_opportunities
  FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Business owners manage compliance" ON public.supplier_diversity_compliance
  FOR ALL TO authenticated
  USING (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid()));
