-- =============================================
-- COALITION LOYALTY PROGRAM TABLES
-- =============================================

-- Coalition points pool (unified points across all businesses)
CREATE TABLE public.coalition_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  points INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  tier VARCHAR(50) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  tier_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id)
);

-- Coalition transactions (tracks point flow between businesses)
CREATE TABLE public.coalition_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  source_business_id UUID REFERENCES public.businesses(id),
  redeem_business_id UUID REFERENCES public.businesses(id),
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('earn', 'redeem', 'transfer', 'bonus', 'referral')),
  points INTEGER NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business coalition membership
CREATE TABLE public.coalition_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  contribution_rate DECIMAL(5,2) DEFAULT 2.5,
  redemption_rate DECIMAL(5,2) DEFAULT 100,
  total_points_generated INTEGER DEFAULT 0,
  total_points_redeemed INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coalition rewards (cross-business rewards)
CREATE TABLE public.coalition_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points_cost INTEGER NOT NULL,
  reward_type VARCHAR(50) CHECK (reward_type IN ('discount', 'product', 'service', 'experience')),
  discount_percentage INTEGER,
  discount_amount DECIMAL(10,2),
  valid_at_all_businesses BOOLEAN DEFAULT true,
  specific_business_ids UUID[],
  max_redemptions INTEGER,
  current_redemptions INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coalition reward redemptions
CREATE TABLE public.coalition_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) NOT NULL,
  reward_id UUID REFERENCES public.coalition_rewards(id) NOT NULL,
  business_id UUID REFERENCES public.businesses(id),
  points_spent INTEGER NOT NULL,
  redemption_code VARCHAR(20) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'redeemed', 'expired', 'cancelled')),
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- B2B SUPPLIER MATCHING TABLES
-- =============================================

-- Business capabilities (what they can supply)
CREATE TABLE public.business_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  capability_type VARCHAR(100) NOT NULL CHECK (capability_type IN ('supplier', 'vendor', 'contractor', 'service_provider', 'wholesaler', 'manufacturer')),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  minimum_order_value DECIMAL(10,2),
  maximum_capacity TEXT,
  lead_time_days INTEGER,
  service_area TEXT[],
  certifications TEXT[],
  pricing_model VARCHAR(50) CHECK (pricing_model IN ('fixed', 'hourly', 'project', 'negotiable', 'volume_based')),
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business needs (what they're looking for)
CREATE TABLE public.business_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) NOT NULL,
  need_type VARCHAR(100) NOT NULL CHECK (need_type IN ('recurring', 'one_time', 'project', 'urgent')),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  urgency VARCHAR(50) CHECK (urgency IN ('immediate', 'within_week', 'within_month', 'planning', 'flexible')),
  quantity TEXT,
  preferred_location TEXT[],
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'matched', 'fulfilled', 'cancelled')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2B connections/matches
CREATE TABLE public.b2b_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_business_id UUID REFERENCES public.businesses(id) NOT NULL,
  supplier_business_id UUID REFERENCES public.businesses(id) NOT NULL,
  connection_type VARCHAR(50) CHECK (connection_type IN ('inquiry', 'negotiation', 'contracted', 'completed', 'cancelled')),
  initial_need_id UUID REFERENCES public.business_needs(id),
  capability_id UUID REFERENCES public.business_capabilities(id),
  match_score DECIMAL(5,2),
  notes TEXT,
  estimated_value DECIMAL(12,2),
  actual_value DECIMAL(12,2),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'in_progress', 'completed', 'cancelled')),
  initiated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2B transaction history (for economic impact tracking)
CREATE TABLE public.b2b_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES public.b2b_connections(id),
  buyer_business_id UUID REFERENCES public.businesses(id) NOT NULL,
  supplier_business_id UUID REFERENCES public.businesses(id) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  invoice_reference VARCHAR(100),
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2B ratings/reviews
CREATE TABLE public.b2b_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES public.b2b_connections(id),
  reviewer_business_id UUID REFERENCES public.businesses(id) NOT NULL,
  reviewed_business_id UUID REFERENCES public.businesses(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  review_text TEXT,
  would_recommend BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2B messages
CREATE TABLE public.b2b_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES public.b2b_connections(id) NOT NULL,
  sender_business_id UUID REFERENCES public.businesses(id) NOT NULL,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Coalition Points RLS
ALTER TABLE public.coalition_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coalition points"
ON public.coalition_points FOR SELECT
USING (auth.uid() = customer_id);

CREATE POLICY "System can manage coalition points"
ON public.coalition_points FOR ALL
USING (true)
WITH CHECK (true);

-- Coalition Transactions RLS
ALTER TABLE public.coalition_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coalition transactions"
ON public.coalition_transactions FOR SELECT
USING (auth.uid() = customer_id);

CREATE POLICY "Business owners can view transactions for their business"
ON public.coalition_transactions FOR SELECT
USING (
  source_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  OR redeem_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
);

CREATE POLICY "System can insert coalition transactions"
ON public.coalition_transactions FOR INSERT
WITH CHECK (true);

-- Coalition Members RLS
ALTER TABLE public.coalition_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coalition members"
ON public.coalition_members FOR SELECT
USING (is_active = true);

CREATE POLICY "Business owners can manage their coalition membership"
ON public.coalition_members FOR ALL
USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Admins can manage all coalition members"
ON public.coalition_members FOR ALL
USING (is_admin_secure());

-- Coalition Rewards RLS
ALTER TABLE public.coalition_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coalition rewards"
ON public.coalition_rewards FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage coalition rewards"
ON public.coalition_rewards FOR ALL
USING (is_admin_secure());

-- Coalition Redemptions RLS
ALTER TABLE public.coalition_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own redemptions"
ON public.coalition_redemptions FOR SELECT
USING (auth.uid() = customer_id);

CREATE POLICY "Users can create their own redemptions"
ON public.coalition_redemptions FOR INSERT
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Business owners can view redemptions at their business"
ON public.coalition_redemptions FOR SELECT
USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Business Capabilities RLS
ALTER TABLE public.business_capabilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active capabilities"
ON public.business_capabilities FOR SELECT
USING (is_active = true);

CREATE POLICY "Business owners can manage their capabilities"
ON public.business_capabilities FOR ALL
USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Business Needs RLS
ALTER TABLE public.business_needs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view open needs"
ON public.business_needs FOR SELECT
USING (status = 'open');

CREATE POLICY "Business owners can manage their needs"
ON public.business_needs FOR ALL
USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- B2B Connections RLS
ALTER TABLE public.b2b_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses can view their connections"
ON public.b2b_connections FOR SELECT
USING (
  buyer_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  OR supplier_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
);

CREATE POLICY "Businesses can create connections"
ON public.b2b_connections FOR INSERT
WITH CHECK (
  buyer_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  OR supplier_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
);

CREATE POLICY "Businesses can update their connections"
ON public.b2b_connections FOR UPDATE
USING (
  buyer_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  OR supplier_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
);

-- B2B Transactions RLS
ALTER TABLE public.b2b_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses can view their B2B transactions"
ON public.b2b_transactions FOR SELECT
USING (
  buyer_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  OR supplier_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
);

CREATE POLICY "Businesses can insert their B2B transactions"
ON public.b2b_transactions FOR INSERT
WITH CHECK (
  buyer_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  OR supplier_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
);

-- B2B Reviews RLS
ALTER TABLE public.b2b_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view B2B reviews"
ON public.b2b_reviews FOR SELECT
USING (true);

CREATE POLICY "Businesses can create reviews for their connections"
ON public.b2b_reviews FOR INSERT
WITH CHECK (reviewer_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- B2B Messages RLS
ALTER TABLE public.b2b_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses can view messages for their connections"
ON public.b2b_messages FOR SELECT
USING (
  connection_id IN (
    SELECT id FROM b2b_connections 
    WHERE buyer_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
    OR supplier_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  )
);

CREATE POLICY "Businesses can send messages for their connections"
ON public.b2b_messages FOR INSERT
WITH CHECK (sender_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Businesses can update messages they received"
ON public.b2b_messages FOR UPDATE
USING (
  connection_id IN (
    SELECT id FROM b2b_connections 
    WHERE buyer_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
    OR supplier_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  )
);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to calculate tier based on lifetime points
CREATE OR REPLACE FUNCTION public.calculate_coalition_tier(lifetime_points INTEGER)
RETURNS VARCHAR(50)
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF lifetime_points >= 15000 THEN
    RETURN 'platinum';
  ELSIF lifetime_points >= 5000 THEN
    RETURN 'gold';
  ELSIF lifetime_points >= 1000 THEN
    RETURN 'silver';
  ELSE
    RETURN 'bronze';
  END IF;
END;
$$;

-- Function to get tier multiplier
CREATE OR REPLACE FUNCTION public.get_tier_multiplier(tier VARCHAR(50))
RETURNS DECIMAL(3,2)
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  CASE tier
    WHEN 'platinum' THEN RETURN 2.0;
    WHEN 'gold' THEN RETURN 1.5;
    WHEN 'silver' THEN RETURN 1.25;
    ELSE RETURN 1.0;
  END CASE;
END;
$$;

-- Function to award coalition points
CREATE OR REPLACE FUNCTION public.award_coalition_points(
  p_customer_id UUID,
  p_business_id UUID,
  p_base_points INTEGER,
  p_description TEXT DEFAULT 'Points earned'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_current_tier VARCHAR(50);
  v_multiplier DECIMAL(3,2);
  v_final_points INTEGER;
  v_new_total INTEGER;
  v_new_lifetime INTEGER;
  v_new_tier VARCHAR(50);
  v_result JSONB;
BEGIN
  -- Check if business is a coalition member
  IF NOT EXISTS (SELECT 1 FROM coalition_members WHERE business_id = p_business_id AND is_active = true) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Business is not a coalition member');
  END IF;

  -- Get or create coalition points record
  INSERT INTO coalition_points (customer_id, points, lifetime_earned, tier)
  VALUES (p_customer_id, 0, 0, 'bronze')
  ON CONFLICT (customer_id) DO NOTHING;

  -- Get current tier
  SELECT tier INTO v_current_tier FROM coalition_points WHERE customer_id = p_customer_id;
  
  -- Calculate multiplier and final points
  v_multiplier := get_tier_multiplier(v_current_tier);
  v_final_points := FLOOR(p_base_points * v_multiplier);

  -- Update points
  UPDATE coalition_points
  SET 
    points = points + v_final_points,
    lifetime_earned = lifetime_earned + v_final_points,
    tier = calculate_coalition_tier(lifetime_earned + v_final_points),
    tier_updated_at = CASE 
      WHEN tier != calculate_coalition_tier(lifetime_earned + v_final_points) THEN NOW()
      ELSE tier_updated_at
    END,
    updated_at = NOW()
  WHERE customer_id = p_customer_id
  RETURNING points, lifetime_earned, tier INTO v_new_total, v_new_lifetime, v_new_tier;

  -- Record transaction
  INSERT INTO coalition_transactions (customer_id, source_business_id, transaction_type, points, description)
  VALUES (p_customer_id, p_business_id, 'earn', v_final_points, p_description);

  -- Update business stats
  UPDATE coalition_members
  SET total_points_generated = total_points_generated + v_final_points, updated_at = NOW()
  WHERE business_id = p_business_id;

  v_result := jsonb_build_object(
    'success', true,
    'base_points', p_base_points,
    'multiplier', v_multiplier,
    'points_earned', v_final_points,
    'total_points', v_new_total,
    'lifetime_points', v_new_lifetime,
    'tier', v_new_tier,
    'tier_upgraded', v_current_tier != v_new_tier
  );

  RETURN v_result;
END;
$$;

-- Function to get coalition stats
CREATE OR REPLACE FUNCTION public.get_coalition_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_members', (SELECT COUNT(*) FROM coalition_members WHERE is_active = true),
    'total_customers', (SELECT COUNT(*) FROM coalition_points),
    'total_points_circulated', (SELECT COALESCE(SUM(points), 0) FROM coalition_transactions WHERE transaction_type = 'earn'),
    'total_points_redeemed', (SELECT COALESCE(SUM(ABS(points)), 0) FROM coalition_transactions WHERE transaction_type = 'redeem'),
    'platinum_members', (SELECT COUNT(*) FROM coalition_points WHERE tier = 'platinum'),
    'gold_members', (SELECT COUNT(*) FROM coalition_points WHERE tier = 'gold'),
    'silver_members', (SELECT COUNT(*) FROM coalition_points WHERE tier = 'silver'),
    'bronze_members', (SELECT COUNT(*) FROM coalition_points WHERE tier = 'bronze')
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- Function to get B2B impact metrics
CREATE OR REPLACE FUNCTION public.get_b2b_impact_metrics()
RETURNS JSONB
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_connections', (SELECT COUNT(*) FROM b2b_connections WHERE status != 'cancelled'),
    'active_connections', (SELECT COUNT(*) FROM b2b_connections WHERE status = 'in_progress'),
    'completed_connections', (SELECT COUNT(*) FROM b2b_connections WHERE status = 'completed'),
    'total_transaction_value', (SELECT COALESCE(SUM(amount), 0) FROM b2b_transactions),
    'active_suppliers', (SELECT COUNT(DISTINCT business_id) FROM business_capabilities WHERE is_active = true),
    'open_needs', (SELECT COUNT(*) FROM business_needs WHERE status = 'open'),
    'average_match_score', (SELECT COALESCE(AVG(match_score), 0) FROM b2b_connections WHERE match_score IS NOT NULL),
    'money_kept_in_community', (SELECT COALESCE(SUM(amount), 0) FROM b2b_transactions)
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_coalition_points_customer ON coalition_points(customer_id);
CREATE INDEX idx_coalition_points_tier ON coalition_points(tier);
CREATE INDEX idx_coalition_transactions_customer ON coalition_transactions(customer_id);
CREATE INDEX idx_coalition_transactions_source ON coalition_transactions(source_business_id);
CREATE INDEX idx_coalition_members_business ON coalition_members(business_id);
CREATE INDEX idx_coalition_members_active ON coalition_members(is_active);
CREATE INDEX idx_business_capabilities_category ON business_capabilities(category);
CREATE INDEX idx_business_capabilities_business ON business_capabilities(business_id);
CREATE INDEX idx_business_needs_status ON business_needs(status);
CREATE INDEX idx_business_needs_category ON business_needs(category);
CREATE INDEX idx_b2b_connections_buyer ON b2b_connections(buyer_business_id);
CREATE INDEX idx_b2b_connections_supplier ON b2b_connections(supplier_business_id);
CREATE INDEX idx_b2b_connections_status ON b2b_connections(status);