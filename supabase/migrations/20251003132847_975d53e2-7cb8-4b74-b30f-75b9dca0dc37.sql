-- Feature 1: Multi-Location Business Support
-- Add parent business support for chains and franchises

-- Add parent_business_id to businesses table (skip if exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'businesses' AND column_name = 'parent_business_id'
  ) THEN
    ALTER TABLE businesses
    ADD COLUMN parent_business_id uuid REFERENCES businesses(id) ON DELETE SET NULL,
    ADD COLUMN location_type varchar(20) DEFAULT 'independent' CHECK (location_type IN ('independent', 'parent', 'location')),
    ADD COLUMN location_name varchar(255),
    ADD COLUMN location_manager_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_businesses_parent_id ON businesses(parent_business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_location_type ON businesses(location_type);

-- Create business_locations view
CREATE OR REPLACE VIEW business_locations_view AS
SELECT 
  b.id,
  b.business_name,
  b.location_name,
  b.location_type,
  b.parent_business_id,
  p.business_name as parent_business_name,
  b.owner_id,
  b.location_manager_id,
  b.city,
  b.state,
  b.is_verified,
  b.created_at
FROM businesses b
LEFT JOIN businesses p ON b.parent_business_id = p.id;

-- Create function to get all locations for a parent business
CREATE OR REPLACE FUNCTION get_business_locations(p_parent_business_id uuid)
RETURNS TABLE(
  id uuid,
  business_name varchar,
  location_name varchar,
  city varchar,
  state varchar,
  location_manager_id uuid,
  is_verified boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.business_name,
    b.location_name,
    b.city,
    b.state,
    b.location_manager_id,
    b.is_verified,
    b.created_at
  FROM businesses b
  WHERE b.parent_business_id = p_parent_business_id
  ORDER BY b.location_name;
END;
$$;

-- Create function to get aggregated analytics for parent business
CREATE OR REPLACE FUNCTION get_parent_business_analytics(p_parent_business_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT (
    auth.uid() IN (SELECT owner_id FROM businesses WHERE id = p_parent_business_id)
    OR is_admin()
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT jsonb_build_object(
    'total_locations', COUNT(DISTINCT b.id),
    'total_transactions', COUNT(DISTINCT t.id),
    'total_revenue', COALESCE(SUM(t.amount), 0),
    'total_customers', COUNT(DISTINCT t.customer_id),
    'total_qr_scans', COUNT(DISTINCT q.id),
    'locations_breakdown', jsonb_agg(DISTINCT jsonb_build_object(
      'location_id', b.id,
      'location_name', b.location_name,
      'city', b.city,
      'transaction_count', (SELECT COUNT(*) FROM transactions WHERE business_id = b.id),
      'revenue', (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE business_id = b.id)
    ))
  ) INTO result
  FROM businesses b
  LEFT JOIN transactions t ON t.business_id = b.id
  LEFT JOIN qr_scans q ON q.business_id = b.id
  WHERE b.parent_business_id = p_parent_business_id OR b.id = p_parent_business_id;
  
  RETURN result;
END;
$$;

-- Update RLS policy for multi-location support
DROP POLICY IF EXISTS "Business owners can access their complete business data" ON businesses;

CREATE POLICY "Business owners can access their complete business data"
ON businesses
FOR ALL
USING (
  auth.uid() = owner_id 
  OR auth.uid() = location_manager_id
  OR auth.uid() IN (
    SELECT owner_id FROM businesses parent 
    WHERE parent.id = businesses.parent_business_id
  )
);

-- Feature 2: Advanced Analytics Foundation
-- Function to record analytics metrics
CREATE OR REPLACE FUNCTION record_business_metric(
  p_business_id uuid,
  p_metric_type varchar,
  p_metric_value numeric,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO business_analytics (business_id, metric_type, metric_value, metadata)
  VALUES (p_business_id, p_metric_type, p_metric_value, p_metadata)
  ON CONFLICT (business_id, date_recorded, metric_type)
  DO UPDATE SET 
    metric_value = business_analytics.metric_value + EXCLUDED.metric_value,
    metadata = EXCLUDED.metadata;
END;
$$;

-- Feature 3: Enhanced Referral/Affiliate System
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sales_agents' AND column_name = 'tier'
  ) THEN
    ALTER TABLE sales_agents
    ADD COLUMN tier varchar(20) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    ADD COLUMN lifetime_referrals integer DEFAULT 0,
    ADD COLUMN monthly_referrals integer DEFAULT 0,
    ADD COLUMN last_tier_update timestamp with time zone DEFAULT now();
  END IF;
END $$;

-- Create referral tracking table
CREATE TABLE IF NOT EXISTS referral_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_agent_id uuid NOT NULL REFERENCES sales_agents(id) ON DELETE CASCADE,
  referral_code text NOT NULL,
  clicked_at timestamp with time zone DEFAULT now(),
  ip_address inet,
  user_agent text,
  converted boolean DEFAULT false,
  converted_user_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_clicks_agent ON referral_clicks(sales_agent_id);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_converted ON referral_clicks(converted);

ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agents can view their referral clicks" ON referral_clicks;
CREATE POLICY "Agents can view their referral clicks"
ON referral_clicks
FOR SELECT
USING (
  sales_agent_id IN (
    SELECT id FROM sales_agents WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "System can insert referral clicks" ON referral_clicks;
CREATE POLICY "System can insert referral clicks"
ON referral_clicks
FOR INSERT
WITH CHECK (true);

-- Function to update agent tier
CREATE OR REPLACE FUNCTION update_agent_tier(p_agent_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lifetime_referrals integer;
  v_new_tier varchar(20);
  v_new_commission_rate numeric;
BEGIN
  SELECT lifetime_referrals INTO v_lifetime_referrals
  FROM sales_agents
  WHERE id = p_agent_id;
  
  IF v_lifetime_referrals >= 100 THEN
    v_new_tier := 'platinum';
    v_new_commission_rate := 15.0;
  ELSIF v_lifetime_referrals >= 50 THEN
    v_new_tier := 'gold';
    v_new_commission_rate := 12.5;
  ELSIF v_lifetime_referrals >= 20 THEN
    v_new_tier := 'silver';
    v_new_commission_rate := 11.0;
  ELSE
    v_new_tier := 'bronze';
    v_new_commission_rate := 10.0;
  END IF;
  
  UPDATE sales_agents
  SET 
    tier = v_new_tier,
    commission_rate = v_new_commission_rate,
    last_tier_update = now()
  WHERE id = p_agent_id;
END;
$$;

-- Feature 4: White-Label Foundation
CREATE TABLE IF NOT EXISTS tenant_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE UNIQUE,
  subdomain varchar(63) UNIQUE,
  custom_domain varchar(255) UNIQUE,
  primary_color varchar(7) DEFAULT '#1a365d',
  secondary_color varchar(7) DEFAULT '#2563eb',
  accent_color varchar(7) DEFAULT '#10b981',
  logo_url text,
  favicon_url text,
  custom_css text,
  branding_enabled boolean DEFAULT false,
  api_key_hash text,
  webhook_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenant_subdomain ON tenant_configurations(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenant_domain ON tenant_configurations(custom_domain);

ALTER TABLE tenant_configurations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business owners can manage their tenant config" ON tenant_configurations;
CREATE POLICY "Business owners can manage their tenant config"
ON tenant_configurations
FOR ALL
USING (
  auth.uid() IN (
    SELECT owner_id FROM businesses WHERE id = tenant_configurations.business_id
  )
);

-- Function to generate API key
CREATE OR REPLACE FUNCTION generate_white_label_api_key(p_business_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_api_key text;
  v_api_key_hash text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM businesses WHERE id = p_business_id AND owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  v_api_key := 'wl_' || encode(gen_random_bytes(32), 'hex');
  v_api_key_hash := encode(digest(v_api_key, 'sha256'), 'hex');
  
  INSERT INTO tenant_configurations (business_id, api_key_hash)
  VALUES (p_business_id, v_api_key_hash)
  ON CONFLICT (business_id)
  DO UPDATE SET api_key_hash = v_api_key_hash, updated_at = now();
  
  RETURN v_api_key;
END;
$$;