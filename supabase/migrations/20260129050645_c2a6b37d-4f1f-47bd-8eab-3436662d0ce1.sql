-- =====================================================
-- Partner-Developer Ecosystem Cross-Pollination Schema
-- =====================================================

-- 1. Technical Partner Tier Table
-- Links developers who also earn revenue from business referrals through their apps
CREATE TABLE public.technical_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES public.developer_accounts(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES public.directory_partners(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  revenue_share_percent NUMERIC(5,2) DEFAULT 5.00,
  total_app_referrals INTEGER DEFAULT 0,
  total_app_earnings NUMERIC(12,2) DEFAULT 0,
  app_name TEXT,
  app_url TEXT,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on technical_partners
ALTER TABLE public.technical_partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for technical_partners
CREATE POLICY "Users can view their own technical partner record"
ON public.technical_partners FOR SELECT
USING (
  developer_id IN (
    SELECT id FROM public.developer_accounts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all technical partners"
ON public.technical_partners FOR SELECT
USING (public.is_admin_secure());

CREATE POLICY "Admins can manage technical partners"
ON public.technical_partners FOR ALL
USING (public.is_admin_secure());

CREATE POLICY "Users can apply as technical partner"
ON public.technical_partners FOR INSERT
WITH CHECK (
  developer_id IN (
    SELECT id FROM public.developer_accounts WHERE user_id = auth.uid()
  )
);

-- 2. App-Business Attribution Table
-- Tracks which businesses were acquired through which developer app
CREATE TABLE public.app_business_attributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES public.developer_accounts(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  attribution_source TEXT,
  api_calls_generated INTEGER DEFAULT 0,
  earnings_attributed NUMERIC(12,2) DEFAULT 0,
  first_api_call_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(developer_id, business_id)
);

-- Enable RLS on app_business_attributions
ALTER TABLE public.app_business_attributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for app_business_attributions
CREATE POLICY "Users can view their own attributions"
ON public.app_business_attributions FOR SELECT
USING (
  developer_id IN (
    SELECT id FROM public.developer_accounts WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all attributions"
ON public.app_business_attributions FOR SELECT
USING (public.is_admin_secure());

CREATE POLICY "System can insert attributions"
ON public.app_business_attributions FOR INSERT
WITH CHECK (true);

-- 3. Partner-Referred Businesses API View (for developers)
-- Exposes anonymized partner-referred businesses as API data sources
CREATE OR REPLACE VIEW public.partner_referred_businesses_api AS
SELECT 
  b.id,
  b.business_name,
  b.category,
  b.city,
  b.state,
  b.average_rating,
  b.review_count,
  pr.partner_id,
  dp.directory_name AS referring_directory,
  dp.tier AS partner_tier,
  pr.converted_at AS joined_at
FROM public.businesses b
JOIN public.partner_referrals pr ON pr.referred_business_id = b.id
JOIN public.directory_partners dp ON dp.id = pr.partner_id
WHERE pr.is_converted = true
AND b.is_verified = true;

-- 4. Cross-Ecosystem Stats View (for analytics)
CREATE OR REPLACE VIEW public.ecosystem_cross_stats AS
SELECT
  (SELECT COUNT(*) FROM public.directory_partners WHERE status = 'active') AS active_partners,
  (SELECT COUNT(*) FROM public.developer_accounts WHERE status = 'active') AS active_developers,
  (SELECT COUNT(*) FROM public.technical_partners WHERE status = 'active') AS technical_partners,
  (SELECT COUNT(*) FROM public.partner_referrals WHERE is_converted = true) AS partner_referred_businesses,
  (SELECT COUNT(*) FROM public.app_business_attributions) AS app_attributed_businesses,
  (SELECT COALESCE(SUM(total_earnings), 0) FROM public.directory_partners) AS total_partner_earnings,
  (SELECT COALESCE(SUM(total_app_earnings), 0) FROM public.technical_partners) AS total_technical_partner_earnings;

-- 5. Indexes for performance
CREATE INDEX idx_technical_partners_developer_id ON public.technical_partners(developer_id);
CREATE INDEX idx_technical_partners_status ON public.technical_partners(status);
CREATE INDEX idx_app_business_attributions_developer_id ON public.app_business_attributions(developer_id);
CREATE INDEX idx_app_business_attributions_business_id ON public.app_business_attributions(business_id);

-- 6. Trigger for updated_at on technical_partners
CREATE TRIGGER update_technical_partners_updated_at
BEFORE UPDATE ON public.technical_partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();