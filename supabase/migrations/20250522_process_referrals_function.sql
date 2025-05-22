
-- Create function to process referrals
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
BEGIN
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
      
      -- Calculate commission
      commission_amount := (subscription_amount * commission_rate) / 100;
      
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
    END IF;
  END LOOP;
END;
$$;

-- Create a trigger to process referrals when new users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user_referral()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If the new user has a referral code in their metadata, process it
  IF NEW.raw_user_metadata->>'referral_code' IS NOT NULL THEN
    -- This will run async after the trigger completes
    PERFORM pg_notify('process_referrals', NEW.id::text);
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to fire after a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;
CREATE TRIGGER on_auth_user_created_referral
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_referral();
