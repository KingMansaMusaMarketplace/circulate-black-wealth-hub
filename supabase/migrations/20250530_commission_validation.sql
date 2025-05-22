
-- Create a function to calculate commission amounts for a referral
CREATE OR REPLACE FUNCTION public.calculate_commission_amount(
  p_subscription_amount NUMERIC,
  p_rate NUMERIC DEFAULT 10.0
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  v_commission NUMERIC;
BEGIN
  -- Validate inputs
  IF p_subscription_amount IS NULL OR p_subscription_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid subscription amount: %', p_subscription_amount;
  END IF;
  
  IF p_rate IS NULL OR p_rate < 0 OR p_rate > 100 THEN
    RAISE EXCEPTION 'Invalid commission rate: %', p_rate;
  END IF;
  
  -- Calculate commission
  v_commission := (p_subscription_amount * p_rate) / 100.0;
  
  -- Round to 2 decimal places
  RETURN ROUND(v_commission, 2);
END;
$$;

-- Create activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create error logs table
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_message TEXT NOT NULL,
  error_code TEXT,
  operation TEXT NOT NULL,
  details JSONB,
  service TEXT NOT NULL,
  function_name TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS to these tables
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admins can read activity logs"
  ON public.activity_logs
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can read error logs"
  ON public.error_logs
  FOR SELECT
  USING (is_admin());

-- Admins can insert logs
CREATE POLICY "Anyone can insert activity logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can insert error logs"
  ON public.error_logs
  FOR INSERT
  WITH CHECK (true);

-- Update the process_pending_referrals function to use our new commission calculator
CREATE OR REPLACE FUNCTION public.process_pending_referrals()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_referral RECORD;
  agent_id UUID;
  commission_rate DECIMAL;
  subscription_amount DECIMAL;
  commission_amount DECIMAL;
  v_log_id UUID;
BEGIN
  -- Log the start of processing
  INSERT INTO public.activity_logs (activity_type, entity_type, entity_id, details)
  VALUES ('process_referrals_start', 'system', 'database', jsonb_build_object('source', 'database_function'))
  RETURNING id INTO v_log_id;

  -- Loop through newly signed up users with referral codes
  FOR new_referral IN 
    SELECT 
      au.id as user_id,
      au.raw_user_metadata->>'referral_code' as referral_code,
      au.created_at
    FROM auth.users au
    WHERE 
      au.raw_user_metadata->>'referral_code' IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM public.referrals r 
        WHERE r.referred_user_id = au.id
      )
  LOOP
    BEGIN
      -- Find the agent by referral code
      SELECT id, commission_rate INTO agent_id, commission_rate
      FROM public.sales_agents
      WHERE referral_code = new_referral.referral_code
        AND is_active = true;
      
      IF agent_id IS NOT NULL THEN
        -- Determine subscription amount based on user type
        SELECT 
          CASE 
            WHEN p.user_type = 'business' THEN 100.00 -- Example business subscription amount
            ELSE 10.00 -- Example standard user subscription
          END INTO subscription_amount
        FROM public.profiles p
        WHERE p.id = new_referral.user_id;
        
        -- Calculate commission using the validation function
        SELECT public.calculate_commission_amount(subscription_amount, commission_rate) 
        INTO commission_amount;
        
        -- Create referral record
        INSERT INTO public.referrals (
          sales_agent_id,
          referred_user_id,
          referred_user_type,
          referral_date,
          commission_amount,
          commission_status,
          subscription_amount
        ) VALUES (
          agent_id,
          new_referral.user_id,
          (SELECT user_type FROM public.profiles WHERE id = new_referral.user_id),
          new_referral.created_at,
          commission_amount,
          'pending',
          subscription_amount
        );
        
        -- Update profile to link to the agent
        UPDATE public.profiles
        SET referred_by = agent_id
        WHERE id = new_referral.user_id;
        
        -- Log successful referral processing
        INSERT INTO public.activity_logs (
          activity_type, 
          entity_type, 
          entity_id, 
          details
        )
        VALUES (
          'process_referral_success', 
          'referral', 
          new_referral.user_id::text, 
          jsonb_build_object(
            'agent_id', agent_id,
            'commission_amount', commission_amount,
            'subscription_amount', subscription_amount
          )
        );
      ELSE
        -- Log invalid referral code
        INSERT INTO public.activity_logs (
          activity_type, 
          entity_type, 
          entity_id, 
          details
        )
        VALUES (
          'invalid_referral_code', 
          'user', 
          new_referral.user_id::text, 
          jsonb_build_object('referral_code', new_referral.referral_code)
        );
      END IF;
      
    EXCEPTION WHEN OTHERS THEN
      -- Log error for this specific referral but continue processing others
      INSERT INTO public.error_logs (
        error_message,
        error_code,
        operation,
        details,
        service
      )
      VALUES (
        SQLERRM,
        SQLSTATE,
        'process_pending_referrals',
        jsonb_build_object(
          'user_id', new_referral.user_id,
          'referral_code', new_referral.referral_code
        ),
        'database_function'
      );
    END;
  END LOOP;
  
  -- Log completion
  UPDATE public.activity_logs
  SET details = jsonb_build_object(
    'source', 'database_function',
    'completed_at', now()
  )
  WHERE id = v_log_id;
  
EXCEPTION WHEN OTHERS THEN
  -- Log any overall function errors
  INSERT INTO public.error_logs (
    error_message,
    error_code,
    operation,
    service
  )
  VALUES (
    SQLERRM,
    SQLSTATE,
    'process_pending_referrals',
    'database_function'
  );
  
  -- Re-raise the exception
  RAISE;
END;
$$;
