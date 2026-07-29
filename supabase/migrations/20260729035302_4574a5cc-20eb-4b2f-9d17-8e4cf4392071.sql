
-- Helper: check if current user is admin (or service/internal call with no auth context)
CREATE OR REPLACE FUNCTION public._is_admin_or_service()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN RETURN true; END IF;
  RETURN public.has_role(_uid, 'admin'::app_role);
END;
$$;

-- featured_placements
CREATE OR REPLACE FUNCTION public.lock_featured_placements_admin_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.priority_score IS DISTINCT FROM OLD.priority_score THEN
    RAISE EXCEPTION 'Only administrators may change status, tier, or priority_score on featured_placements'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS lock_featured_placements_admin_cols ON public.featured_placements;
CREATE TRIGGER lock_featured_placements_admin_cols
  BEFORE UPDATE ON public.featured_placements
  FOR EACH ROW EXECUTE FUNCTION public.lock_featured_placements_admin_cols();

-- job_postings
CREATE OR REPLACE FUNCTION public.lock_job_postings_admin_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.paid_at IS DISTINCT FROM OLD.paid_at
     OR NEW.amount_cents IS DISTINCT FROM OLD.amount_cents THEN
    RAISE EXCEPTION 'Only administrators may change status, paid_at, or amount_cents on job_postings'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS lock_job_postings_admin_cols ON public.job_postings;
CREATE TRIGGER lock_job_postings_admin_cols
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION public.lock_job_postings_admin_cols();

-- noir_drivers
CREATE OR REPLACE FUNCTION public.lock_noir_drivers_admin_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.is_active IS DISTINCT FROM OLD.is_active
     OR NEW.application_status IS DISTINCT FROM OLD.application_status
     OR NEW.total_earnings IS DISTINCT FROM OLD.total_earnings
     OR NEW.rating_average IS DISTINCT FROM OLD.rating_average
     OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
     OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
     OR NEW.total_rides IS DISTINCT FROM OLD.total_rides THEN
    RAISE EXCEPTION 'Only administrators may change approval, status, earnings, or rating fields on noir_drivers'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS lock_noir_drivers_admin_cols ON public.noir_drivers;
CREATE TRIGGER lock_noir_drivers_admin_cols
  BEFORE UPDATE ON public.noir_drivers
  FOR EACH ROW EXECUTE FUNCTION public.lock_noir_drivers_admin_cols();

-- vacation_properties
CREATE OR REPLACE FUNCTION public.lock_vacation_properties_admin_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.average_rating IS DISTINCT FROM OLD.average_rating
     OR NEW.review_count IS DISTINCT FROM OLD.review_count THEN
    RAISE EXCEPTION 'Only administrators may change is_verified, average_rating, or review_count on vacation_properties'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS lock_vacation_properties_admin_cols ON public.vacation_properties;
CREATE TRIGGER lock_vacation_properties_admin_cols
  BEFORE UPDATE ON public.vacation_properties
  FOR EACH ROW EXECUTE FUNCTION public.lock_vacation_properties_admin_cols();
