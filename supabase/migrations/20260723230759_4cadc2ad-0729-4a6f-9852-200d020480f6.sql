
-- Generic helper (create if missing)
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
$$;

-- 1. businesses
CREATE OR REPLACE FUNCTION public.protect_businesses_admin_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.founding_order IS DISTINCT FROM OLD.founding_order
     OR NEW.total_revenue_tracked IS DISTINCT FROM OLD.total_revenue_tracked
     OR NEW.transaction_count IS DISTINCT FROM OLD.transaction_count THEN
    RAISE EXCEPTION 'Only admins can modify verification, subscription, founding, or revenue fields';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_protect_businesses_admin_fields ON public.businesses;
CREATE TRIGGER trg_protect_businesses_admin_fields
BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.protect_businesses_admin_fields();

-- 2. corporate_subscriptions
CREATE OR REPLACE FUNCTION public.protect_corporate_subscriptions_admin_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  IF NEW.approval_status IS DISTINCT FROM OLD.approval_status
     OR NEW.logo_approved IS DISTINCT FROM OLD.logo_approved
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.is_founding_sponsor IS DISTINCT FROM OLD.is_founding_sponsor THEN
    RAISE EXCEPTION 'Only admins can modify approval, tier, or founding sponsor fields';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_protect_corporate_subscriptions_admin_fields ON public.corporate_subscriptions;
CREATE TRIGGER trg_protect_corporate_subscriptions_admin_fields
BEFORE UPDATE ON public.corporate_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.protect_corporate_subscriptions_admin_fields();

-- 3. featured_placements
CREATE OR REPLACE FUNCTION public.protect_featured_placements_admin_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.priority_score IS DISTINCT FROM OLD.priority_score
     OR NEW.tier IS DISTINCT FROM OLD.tier THEN
    RAISE EXCEPTION 'Only admins or backend service can modify placement status, priority, or tier';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_protect_featured_placements_admin_fields ON public.featured_placements;
CREATE TRIGGER trg_protect_featured_placements_admin_fields
BEFORE UPDATE ON public.featured_placements
FOR EACH ROW EXECUTE FUNCTION public.protect_featured_placements_admin_fields();

-- 4. job_postings
CREATE OR REPLACE FUNCTION public.protect_job_postings_admin_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Only admins or backend service can change job posting status';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_protect_job_postings_admin_fields ON public.job_postings;
CREATE TRIGGER trg_protect_job_postings_admin_fields
BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.protect_job_postings_admin_fields();

-- 5. noir_drivers
CREATE OR REPLACE FUNCTION public.protect_noir_drivers_admin_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    RAISE EXCEPTION 'Only admins can modify driver approval or active status';
  END IF;
  -- allow only draft -> submitted transitions on application_status for owners
  IF NEW.application_status IS DISTINCT FROM OLD.application_status
     AND NOT (OLD.application_status = 'draft' AND NEW.application_status = 'submitted') THEN
    RAISE EXCEPTION 'Only admins can change application status beyond draft->submitted';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_protect_noir_drivers_admin_fields ON public.noir_drivers;
CREATE TRIGGER trg_protect_noir_drivers_admin_fields
BEFORE UPDATE ON public.noir_drivers
FOR EACH ROW EXECUTE FUNCTION public.protect_noir_drivers_admin_fields();

-- 6. vacation_properties
CREATE OR REPLACE FUNCTION public.protect_vacation_properties_admin_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.moderation_status IS DISTINCT FROM OLD.moderation_status
     OR NEW.listing_status IS DISTINCT FROM OLD.listing_status THEN
    RAISE EXCEPTION 'Only admins can modify moderation, listing, or verification status';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_protect_vacation_properties_admin_fields ON public.vacation_properties;
CREATE TRIGGER trg_protect_vacation_properties_admin_fields
BEFORE UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.protect_vacation_properties_admin_fields();
