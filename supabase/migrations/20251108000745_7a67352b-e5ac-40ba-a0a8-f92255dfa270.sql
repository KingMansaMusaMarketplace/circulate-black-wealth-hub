-- Fix search_path security warnings for team bonus functions

-- Update calculate_team_bonus with proper search_path
CREATE OR REPLACE FUNCTION calculate_team_bonus(tier1_points numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN ROUND(tier1_points * 0.30, 2);
END;
$$;

-- Update process_pending_referrals with proper search_path
CREATE OR REPLACE FUNCTION process_pending_referrals()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  processed_count integer := 0;
  tier1_count integer := 0;
  tier2_count integer := 0;
  result jsonb;
  referral_record RECORD;
  tier1_points numeric := 8;
  tier2_points numeric;
  parent_agent_id uuid;
  parent_referral_id uuid;
BEGIN
  FOR referral_record IN 
    SELECT r.id, r.sales_agent_id, r.referred_user_id, r.subscription_amount,
           p.referred_by_agent_id
    FROM referrals r
    LEFT JOIN profiles p ON p.id = r.referred_user_id
    WHERE r.commission_status = 'pending'
    AND EXISTS (
      SELECT 1 FROM profiles prof 
      WHERE prof.id = r.referred_user_id 
      AND prof.user_type IN ('customer', 'business_owner')
    )
  LOOP
    INSERT INTO agent_commissions (
      sales_agent_id,
      referral_id,
      amount,
      status,
      due_date
    ) VALUES (
      referral_record.sales_agent_id,
      referral_record.id,
      tier1_points,
      'pending',
      NOW() + INTERVAL '30 days'
    );
    
    UPDATE referrals 
    SET commission_status = 'approved',
        commission_amount = tier1_points,
        tier = 1
    WHERE id = referral_record.id;
    
    tier1_count := tier1_count + 1;
    
    SELECT sa.id INTO parent_agent_id
    FROM sales_agents sa
    INNER JOIN profiles p ON p.id = sa.user_id
    WHERE p.id = (
      SELECT user_id FROM sales_agents WHERE id = referral_record.sales_agent_id
    )
    AND p.referred_by_agent_id IS NOT NULL;
    
    IF parent_agent_id IS NOT NULL THEN
      tier2_points := calculate_team_bonus(tier1_points);
      
      INSERT INTO referrals (
        sales_agent_id,
        referred_user_id,
        referred_user_type,
        commission_status,
        commission_amount,
        tier,
        parent_referral_id,
        subscription_amount
      ) VALUES (
        parent_agent_id,
        referral_record.referred_user_id,
        'customer',
        'approved',
        tier2_points,
        2,
        referral_record.id,
        referral_record.subscription_amount
      ) RETURNING id INTO parent_referral_id;
      
      INSERT INTO agent_commissions (
        sales_agent_id,
        referral_id,
        amount,
        status,
        due_date
      ) VALUES (
        parent_agent_id,
        parent_referral_id,
        tier2_points,
        'pending',
        NOW() + INTERVAL '30 days'
      );
      
      tier2_count := tier2_count + 1;
    END IF;
    
    processed_count := processed_count + 1;
  END LOOP;
  
  result := jsonb_build_object(
    'processed_count', processed_count,
    'tier1_commissions', tier1_count,
    'tier2_commissions', tier2_count,
    'tier1_points', tier1_points,
    'tier2_points', tier2_points
  );
  
  RETURN result;
END;
$$;