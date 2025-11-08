-- Fix search_path security warning for new functions
DROP FUNCTION IF EXISTS validate_referral_code(TEXT);
DROP FUNCTION IF EXISTS process_business_referral(UUID, TEXT);
DROP FUNCTION IF EXISTS get_business_referral_info(UUID);

-- Recreate with proper search_path
CREATE OR REPLACE FUNCTION validate_referral_code(p_referral_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_agent_id UUID;
  v_agent_name TEXT;
  v_is_active BOOLEAN;
  v_result JSONB;
BEGIN
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

CREATE OR REPLACE FUNCTION process_business_referral(
  p_business_id UUID,
  p_referral_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_agent RECORD;
  v_referral_id UUID;
  v_subscription_amount NUMERIC := 50.00;
  v_commission_amount NUMERIC;
  v_business_owner_id UUID;
  v_override_amount NUMERIC;
  v_override_end_date TIMESTAMP WITH TIME ZONE;
  v_result JSONB;
BEGIN
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
  
  UPDATE businesses
  SET 
    referral_code_used = v_agent.referral_code,
    referred_at = now()
  WHERE id = p_business_id;
  
  SELECT owner_id INTO v_business_owner_id
  FROM businesses
  WHERE id = p_business_id;
  
  v_commission_amount := v_subscription_amount * (v_agent.commission_rate / 100);
  
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
    v_commission_amount,
    v_subscription_amount,
    1
  ) RETURNING id INTO v_referral_id;
  
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
  
  UPDATE sales_agents
  SET lifetime_referrals = lifetime_referrals + 1
  WHERE id = v_agent.id;
  
  PERFORM update_agent_tier(v_agent.id);
  
  IF v_agent.recruited_by_agent_id IS NOT NULL THEN
    SELECT team_override_end_date INTO v_override_end_date
    FROM sales_agents
    WHERE id = v_agent.id;
    
    IF v_override_end_date IS NULL OR v_override_end_date > now() THEN
      v_override_amount := v_commission_amount * 0.075;
      
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
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'referral_id', v_referral_id,
    'commission_amount', v_commission_amount,
    'agent_id', v_agent.id
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_business_referral_info(p_business_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_referral_code TEXT;
  v_agent_name TEXT;
  v_referred_at TIMESTAMP WITH TIME ZONE;
BEGIN
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
    RETURN jsonb_build_object('has_referral', false);
  END IF;
  
  RETURN jsonb_build_object(
    'has_referral', true,
    'referral_code', v_referral_code,
    'agent_name', v_agent_name,
    'referred_at', v_referred_at
  );
END;
$$;

GRANT EXECUTE ON FUNCTION validate_referral_code(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION process_business_referral(UUID, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_business_referral_info(UUID) TO authenticated;