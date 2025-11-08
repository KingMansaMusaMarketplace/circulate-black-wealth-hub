-- Phase 1: Referral Tracking System
-- Add referral tracking to businesses table

ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS referral_code_used TEXT,
ADD COLUMN IF NOT EXISTS referred_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS referral_commission_paid BOOLEAN DEFAULT false;

-- Create index for faster referral lookups
CREATE INDEX IF NOT EXISTS idx_businesses_referral_code ON businesses(referral_code_used);

-- Add referral tracking fields to sales_agents
ALTER TABLE sales_agents
ADD COLUMN IF NOT EXISTS lifetime_referrals INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'bronze',
ADD COLUMN IF NOT EXISTS last_tier_update TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Function to validate if a referral code exists and is active
CREATE OR REPLACE FUNCTION validate_referral_code(p_referral_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_agent_id UUID;
  v_agent_name TEXT;
  v_is_active BOOLEAN;
  v_result JSONB;
BEGIN
  -- Look up the agent by referral code
  SELECT id, full_name, is_active 
  INTO v_agent_id, v_agent_name, v_is_active
  FROM sales_agents
  WHERE referral_code = UPPER(TRIM(p_referral_code));
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invalid referral code'
    );
  END IF;
  
  IF NOT v_is_active THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'This referral code is no longer active'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'valid', true,
    'agent_id', v_agent_id,
    'agent_name', v_agent_name
  );
END;
$$;

-- Function to process business referral and create commission
CREATE OR REPLACE FUNCTION process_business_referral(
  p_business_id UUID,
  p_referral_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_agent RECORD;
  v_referral_id UUID;
  v_subscription_amount NUMERIC := 50.00; -- Default business subscription
  v_commission_amount NUMERIC;
  v_result JSONB;
BEGIN
  -- Validate and get agent info
  SELECT sa.id, sa.referral_code, sa.commission_rate, sa.is_active, sa.recruited_by_agent_id
  INTO v_agent
  FROM sales_agents sa
  WHERE sa.referral_code = UPPER(TRIM(p_referral_code));
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid referral code');
  END IF;
  
  IF NOT v_agent.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'Agent is not active');
  END IF;
  
  -- Update business with referral code
  UPDATE businesses
  SET 
    referral_code_used = v_agent.referral_code,
    referred_at = now()
  WHERE id = p_business_id;
  
  -- Get business owner ID for referral record
  DECLARE
    v_business_owner_id UUID;
  BEGIN
    SELECT owner_id INTO v_business_owner_id
    FROM businesses
    WHERE id = p_business_id;
    
    -- Create referral record
    INSERT INTO referrals (
      sales_agent_id,
      referred_user_id,
      referred_user_type,
      referral_date,
      commission_status,
      commission_amount,
      subscription_amount,
      tier
    ) VALUES (
      v_agent.id,
      v_business_owner_id,
      'business',
      now(),
      'pending',
      v_subscription_amount * (v_agent.commission_rate / 100),
      v_subscription_amount,
      1 -- Tier 1: direct referral
    ) RETURNING id INTO v_referral_id;
  END;
  
  -- Calculate commission amount
  v_commission_amount := v_subscription_amount * (v_agent.commission_rate / 100);
  
  -- Create commission record (due in 30 days)
  INSERT INTO agent_commissions (
    sales_agent_id,
    referral_id,
    amount,
    status,
    due_date
  ) VALUES (
    v_agent.id,
    v_referral_id,
    v_commission_amount,
    'pending',
    now() + INTERVAL '30 days'
  );
  
  -- Update agent's lifetime referral count
  UPDATE sales_agents
  SET lifetime_referrals = lifetime_referrals + 1
  WHERE id = v_agent.id;
  
  -- Update agent tier if needed
  PERFORM update_agent_tier(v_agent.id);
  
  -- If this agent was recruited by another agent, create team override
  IF v_agent.recruited_by_agent_id IS NOT NULL THEN
    DECLARE
      v_override_amount NUMERIC;
      v_override_end_date TIMESTAMP WITH TIME ZONE;
    BEGIN
      -- Check if override period is still active (6 months from recruitment)
      SELECT team_override_end_date INTO v_override_end_date
      FROM sales_agents
      WHERE id = v_agent.id;
      
      IF v_override_end_date IS NULL OR v_override_end_date > now() THEN
        v_override_amount := v_commission_amount * 0.075; -- 7.5% of commission
        
        INSERT INTO agent_team_overrides (
          recruiter_agent_id,
          recruited_agent_id,
          referral_id,
          base_commission_amount,
          override_amount,
          override_percentage,
          status,
          earned_date
        ) VALUES (
          v_agent.recruited_by_agent_id,
          v_agent.id,
          v_referral_id,
          v_commission_amount,
          v_override_amount,
          7.5,
          'pending',
          now()
        );
      END IF;
    END;
  END IF;
  
  v_result := jsonb_build_object(
    'success', true,
    'referral_id', v_referral_id,
    'commission_amount', v_commission_amount,
    'agent_id', v_agent.id
  );
  
  RETURN v_result;
END;
$$;

-- Function to check if a business used a referral code
CREATE OR REPLACE FUNCTION get_business_referral_info(p_business_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral_code TEXT;
  v_agent_name TEXT;
  v_referred_at TIMESTAMP WITH TIME ZONE;
  v_result JSONB;
BEGIN
  -- Check if user owns this business
  IF NOT EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = p_business_id AND owner_id = auth.uid()
  ) AND NOT is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  SELECT b.referral_code_used, b.referred_at, sa.full_name
  INTO v_referral_code, v_referred_at, v_agent_name
  FROM businesses b
  LEFT JOIN sales_agents sa ON sa.referral_code = b.referral_code_used
  WHERE b.id = p_business_id;
  
  IF v_referral_code IS NULL THEN
    RETURN jsonb_build_object(
      'has_referral', false
    );
  END IF;
  
  RETURN jsonb_build_object(
    'has_referral', true,
    'referral_code', v_referral_code,
    'agent_name', v_agent_name,
    'referred_at', v_referred_at
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION validate_referral_code(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION process_business_referral(UUID, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_business_referral_info(UUID) TO authenticated;