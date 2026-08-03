CREATE OR REPLACE FUNCTION public.protect_corporate_subs_v2()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.approval_status IS DISTINCT FROM OLD.approval_status
     OR NEW.is_founding_sponsor IS DISTINCT FROM OLD.is_founding_sponsor
     OR NEW.featured_until IS DISTINCT FROM OLD.featured_until
     OR NEW.is_visible IS DISTINCT FROM OLD.is_visible
     OR NEW.display_priority IS DISTINCT FROM OLD.display_priority THEN
    RAISE EXCEPTION 'Not authorized to modify sponsor tier/status/approval/visibility fields';
  END IF;
  RETURN NEW;
END;
$$;