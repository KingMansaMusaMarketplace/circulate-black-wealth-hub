-- Fix function search path for immutable functions
DROP FUNCTION IF EXISTS public.calculate_coalition_tier(INTEGER);
DROP FUNCTION IF EXISTS public.get_tier_multiplier(VARCHAR);

CREATE OR REPLACE FUNCTION public.calculate_coalition_tier(lifetime_points INTEGER)
RETURNS VARCHAR(50)
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.get_tier_multiplier(tier VARCHAR(50))
RETURNS DECIMAL(3,2)
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path TO 'public'
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