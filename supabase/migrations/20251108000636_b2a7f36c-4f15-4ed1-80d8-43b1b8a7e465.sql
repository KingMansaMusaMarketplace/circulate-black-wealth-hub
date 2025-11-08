-- Add support for 2-tier referral tracking
-- Add referrer_id to profiles to track who referred each user
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referred_by_agent_id uuid REFERENCES sales_agents(id),
ADD COLUMN IF NOT EXISTS referral_tier integer DEFAULT 1;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by_agent_id);

-- Update referrals table to support tier tracking
ALTER TABLE referrals
ADD COLUMN IF NOT EXISTS tier integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_referral_id uuid REFERENCES referrals(id);

-- Add index for parent referral lookups
CREATE INDEX IF NOT EXISTS idx_referrals_parent ON referrals(parent_referral_id);

-- Create function to calculate team bonus (30% of tier 1 points)
CREATE OR REPLACE FUNCTION calculate_team_bonus(tier1_points numeric)
RETURNS numeric
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN ROUND(tier1_points * 0.30, 2);
END;
$$;

-- Update the process_pending_referrals function to handle 2-tier system
CREATE OR REPLACE FUNCTION process_pending_referrals()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  processed_count integer := 0;
  tier1_count integer := 0;
  tier2_count integer := 0;
  result jsonb;
  referral_record RECORD;
  tier1_points numeric := 8; -- Points for direct referral
  tier2_points numeric;
  parent_agent_id uuid;
  parent_referral_id uuid;
BEGIN
  -- Process all pending referrals
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
    -- Award Tier 1 commission (direct referral)
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
    
    -- Update referral status
    UPDATE referrals 
    SET commission_status = 'approved',
        commission_amount = tier1_points,
        tier = 1
    WHERE id = referral_record.id;
    
    tier1_count := tier1_count + 1;
    
    -- Check if the direct referrer was also referred by someone (Tier 2)
    SELECT sa.id INTO parent_agent_id
    FROM sales_agents sa
    INNER JOIN profiles p ON p.id = sa.user_id
    WHERE p.id = (
      SELECT user_id FROM sales_agents WHERE id = referral_record.sales_agent_id
    )
    AND p.referred_by_agent_id IS NOT NULL;
    
    -- If there's a parent agent, award them team bonus (30%)
    IF parent_agent_id IS NOT NULL THEN
      tier2_points := calculate_team_bonus(tier1_points);
      
      -- Create a tier 2 referral record
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
      
      -- Award Tier 2 commission (team bonus)
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
  
  -- Return summary
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