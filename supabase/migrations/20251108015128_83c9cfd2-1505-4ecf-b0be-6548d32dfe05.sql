-- Create function to check and update agent tier based on referral count
CREATE OR REPLACE FUNCTION public.check_and_update_agent_tier(agent_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_referrals INTEGER;
  current_tier TEXT;
  new_tier TEXT;
BEGIN
  -- Get current referral count and tier
  SELECT lifetime_referrals, tier 
  INTO current_referrals, current_tier
  FROM public.sales_agents
  WHERE id = agent_id_param;

  -- Determine new tier based on referral count
  IF current_referrals >= 50 THEN
    new_tier := 'platinum';
  ELSIF current_referrals >= 25 THEN
    new_tier := 'gold';
  ELSIF current_referrals >= 10 THEN
    new_tier := 'silver';
  ELSE
    new_tier := 'bronze';
  END IF;

  -- Update tier if it has changed
  IF new_tier != current_tier THEN
    UPDATE public.sales_agents
    SET 
      tier = new_tier,
      last_tier_update = now()
    WHERE id = agent_id_param;
  END IF;
END;
$$;

-- Create trigger function to check tier after referral updates
CREATE OR REPLACE FUNCTION public.trigger_check_agent_tier()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update lifetime referrals count
  UPDATE public.sales_agents
  SET lifetime_referrals = (
    SELECT COUNT(*)
    FROM public.referrals
    WHERE referring_agent_id = NEW.referring_agent_id
  )
  WHERE id = NEW.referring_agent_id;

  -- Check and update tier
  PERFORM public.check_and_update_agent_tier(NEW.referring_agent_id);

  RETURN NEW;
END;
$$;

-- Create trigger on referrals table
DROP TRIGGER IF EXISTS check_agent_tier_on_referral ON public.referrals;
CREATE TRIGGER check_agent_tier_on_referral
AFTER INSERT ON public.referrals
FOR EACH ROW
EXECUTE FUNCTION public.trigger_check_agent_tier();

-- Create function to get tier progress information
CREATE OR REPLACE FUNCTION public.get_agent_tier_progress(agent_id_param UUID)
RETURNS TABLE(
  current_tier TEXT,
  current_referrals INTEGER,
  next_tier TEXT,
  next_tier_threshold INTEGER,
  progress_percentage NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  referral_count INTEGER;
  agent_tier TEXT;
BEGIN
  -- Get agent data
  SELECT tier, lifetime_referrals 
  INTO agent_tier, referral_count
  FROM public.sales_agents
  WHERE id = agent_id_param;

  -- Calculate next tier info
  RETURN QUERY
  SELECT
    agent_tier as current_tier,
    referral_count as current_referrals,
    CASE
      WHEN agent_tier = 'bronze' THEN 'silver'
      WHEN agent_tier = 'silver' THEN 'gold'
      WHEN agent_tier = 'gold' THEN 'platinum'
      ELSE 'platinum'
    END as next_tier,
    CASE
      WHEN agent_tier = 'bronze' THEN 10
      WHEN agent_tier = 'silver' THEN 25
      WHEN agent_tier = 'gold' THEN 50
      ELSE 50
    END as next_tier_threshold,
    CASE
      WHEN agent_tier = 'bronze' THEN LEAST((referral_count::NUMERIC / 10) * 100, 100)
      WHEN agent_tier = 'silver' THEN LEAST((referral_count::NUMERIC / 25) * 100, 100)
      WHEN agent_tier = 'gold' THEN LEAST((referral_count::NUMERIC / 50) * 100, 100)
      ELSE 100
    END as progress_percentage;
END;
$$;