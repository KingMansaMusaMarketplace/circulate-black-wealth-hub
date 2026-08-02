CREATE OR REPLACE FUNCTION public.protect_businesses_admin_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.founding_order IS DISTINCT FROM OLD.founding_order THEN
    RAISE EXCEPTION 'Only admins can modify verification, subscription, or founding fields';
  END IF;
  RETURN NEW;
END
$$;

UPDATE public.businesses
SET description = 'MaC Venture Capital is a seed-stage venture capital firm investing in technology startups that benefit from shifts in cultural trends and behaviors of tomorrow''s mainstream. Founded by Michael Palank, Adrian Fenty, and Charles King, MaC partners with visionary founders across consumer, enterprise, and frontier technology.'
WHERE business_name = 'MaC Venture Capital';