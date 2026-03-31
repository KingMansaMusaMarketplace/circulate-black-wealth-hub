
-- Business Impact Scorecards table
CREATE TABLE public.business_impact_scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 1000),
  tier TEXT NOT NULL DEFAULT 'seed',
  
  -- Score breakdown dimensions
  wealth_circulation_score INTEGER NOT NULL DEFAULT 0,
  jobs_supported_score INTEGER NOT NULL DEFAULT 0,
  community_engagement_score INTEGER NOT NULL DEFAULT 0,
  b2b_connections_score INTEGER NOT NULL DEFAULT 0,
  reviews_reputation_score INTEGER NOT NULL DEFAULT 0,
  
  -- Raw metrics used for calculation
  total_revenue_circulated NUMERIC(12,2) DEFAULT 0,
  total_transactions INTEGER DEFAULT 0,
  unique_customers INTEGER DEFAULT 0,
  jobs_created_equivalent NUMERIC(6,2) DEFAULT 0,
  b2b_connections_count INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0,
  qr_scans INTEGER DEFAULT 0,
  
  -- Metadata
  last_calculated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(business_id)
);

ALTER TABLE public.business_impact_scorecards ENABLE ROW LEVEL SECURITY;

-- Anyone can view scorecards (public-facing)
CREATE POLICY "Anyone can view impact scorecards"
  ON public.business_impact_scorecards FOR SELECT
  USING (true);

-- Business owners can see their own
CREATE POLICY "Business owners can manage their scorecard"
  ON public.business_impact_scorecards FOR ALL
  TO authenticated
  USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );

-- Function to calculate and upsert a business impact scorecard
CREATE OR REPLACE FUNCTION public.calculate_business_impact_scorecard(p_business_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_revenue NUMERIC := 0;
  v_transactions INTEGER := 0;
  v_unique_customers INTEGER := 0;
  v_jobs NUMERIC := 0;
  v_b2b INTEGER := 0;
  v_reviews INTEGER := 0;
  v_avg_rating NUMERIC := 0;
  v_qr_scans INTEGER := 0;
  
  v_wealth_score INTEGER := 0;
  v_jobs_score INTEGER := 0;
  v_engagement_score INTEGER := 0;
  v_b2b_score INTEGER := 0;
  v_reviews_score INTEGER := 0;
  v_overall INTEGER := 0;
  v_tier TEXT := 'seed';
  v_result JSON;
BEGIN
  -- Gather revenue from verified transactions
  SELECT COALESCE(SUM(amount), 0), COUNT(*), COUNT(DISTINCT customer_id)
  INTO v_revenue, v_transactions, v_unique_customers
  FROM public.verified_transactions
  WHERE business_id = p_business_id;

  -- Jobs estimate: ~1 FTE per $50K revenue
  v_jobs := v_revenue / 50000.0;

  -- B2B connections
  SELECT COUNT(*) INTO v_b2b
  FROM public.b2b_connections
  WHERE (buyer_business_id = p_business_id OR supplier_business_id = p_business_id)
    AND status = 'active';

  -- Reviews
  SELECT COUNT(*), COALESCE(AVG(rating), 0) INTO v_reviews, v_avg_rating
  FROM public.reviews
  WHERE business_id = p_business_id;

  -- QR scans
  SELECT COALESCE(SUM(scan_count), 0) INTO v_qr_scans
  FROM public.qr_codes
  WHERE business_id = p_business_id;

  -- Calculate dimension scores (each 0-200, total max 1000)
  -- Wealth: $0=0, $100K+=200
  v_wealth_score := LEAST(ROUND(v_revenue / 500.0)::INTEGER, 200);
  
  -- Jobs: 0=0, 4+=200
  v_jobs_score := LEAST(ROUND(v_jobs * 50)::INTEGER, 200);
  
  -- Engagement: based on unique customers + QR scans
  v_engagement_score := LEAST(ROUND((v_unique_customers * 2 + v_qr_scans * 0.5))::INTEGER, 200);
  
  -- B2B: 0=0, 10+=200
  v_b2b_score := LEAST(v_b2b * 20, 200);
  
  -- Reviews: weighted by count and rating
  v_reviews_score := LEAST(ROUND(v_reviews * v_avg_rating * 2)::INTEGER, 200);

  v_overall := v_wealth_score + v_jobs_score + v_engagement_score + v_b2b_score + v_reviews_score;

  -- Determine tier
  v_tier := CASE
    WHEN v_overall >= 800 THEN 'diamond'
    WHEN v_overall >= 600 THEN 'gold'
    WHEN v_overall >= 400 THEN 'silver'
    WHEN v_overall >= 200 THEN 'bronze'
    WHEN v_overall >= 50 THEN 'rising'
    ELSE 'seed'
  END;

  -- Upsert
  INSERT INTO public.business_impact_scorecards (
    business_id, overall_score, tier,
    wealth_circulation_score, jobs_supported_score, community_engagement_score,
    b2b_connections_score, reviews_reputation_score,
    total_revenue_circulated, total_transactions, unique_customers,
    jobs_created_equivalent, b2b_connections_count, total_reviews, average_rating, qr_scans,
    last_calculated_at, updated_at
  ) VALUES (
    p_business_id, v_overall, v_tier,
    v_wealth_score, v_jobs_score, v_engagement_score,
    v_b2b_score, v_reviews_score,
    v_revenue, v_transactions, v_unique_customers,
    v_jobs, v_b2b, v_reviews, v_avg_rating, v_qr_scans,
    now(), now()
  )
  ON CONFLICT (business_id) DO UPDATE SET
    overall_score = EXCLUDED.overall_score,
    tier = EXCLUDED.tier,
    wealth_circulation_score = EXCLUDED.wealth_circulation_score,
    jobs_supported_score = EXCLUDED.jobs_supported_score,
    community_engagement_score = EXCLUDED.community_engagement_score,
    b2b_connections_score = EXCLUDED.b2b_connections_score,
    reviews_reputation_score = EXCLUDED.reviews_reputation_score,
    total_revenue_circulated = EXCLUDED.total_revenue_circulated,
    total_transactions = EXCLUDED.total_transactions,
    unique_customers = EXCLUDED.unique_customers,
    jobs_created_equivalent = EXCLUDED.jobs_created_equivalent,
    b2b_connections_count = EXCLUDED.b2b_connections_count,
    total_reviews = EXCLUDED.total_reviews,
    average_rating = EXCLUDED.average_rating,
    qr_scans = EXCLUDED.qr_scans,
    last_calculated_at = now(),
    updated_at = now();

  SELECT row_to_json(s) INTO v_result
  FROM public.business_impact_scorecards s
  WHERE s.business_id = p_business_id;

  RETURN v_result;
END;
$$;

-- Leaderboard RPC
CREATE OR REPLACE FUNCTION public.get_impact_leaderboard(p_limit INTEGER DEFAULT 10)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO v_result
  FROM (
    SELECT 
      s.business_id,
      b.business_name,
      b.logo_url,
      b.category,
      b.city,
      b.state,
      b.is_verified,
      s.overall_score,
      s.tier,
      s.wealth_circulation_score,
      s.jobs_supported_score,
      s.community_engagement_score,
      s.b2b_connections_score,
      s.reviews_reputation_score,
      s.total_revenue_circulated,
      s.jobs_created_equivalent
    FROM public.business_impact_scorecards s
    JOIN public.businesses b ON b.id = s.business_id
    WHERE s.overall_score > 0
    ORDER BY s.overall_score DESC
    LIMIT p_limit
  ) t;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;
