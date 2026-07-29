
-- Featured placements
CREATE OR REPLACE FUNCTION public.enforce_featured_placements_admin_cols()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.status := OLD.status;
  NEW.tier := OLD.tier;
  NEW.priority_score := OLD.priority_score;
  NEW.starts_at := OLD.starts_at;
  NEW.ends_at := OLD.ends_at;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_featured_placements_admin_cols ON public.featured_placements;
CREATE TRIGGER trg_featured_placements_admin_cols BEFORE UPDATE ON public.featured_placements
  FOR EACH ROW EXECUTE FUNCTION public.enforce_featured_placements_admin_cols();

-- Job postings
CREATE OR REPLACE FUNCTION public.enforce_job_postings_admin_cols()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.status := OLD.status;
  NEW.paid_at := OLD.paid_at;
  NEW.amount_cents := OLD.amount_cents;
  NEW.expires_at := OLD.expires_at;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_job_postings_admin_cols ON public.job_postings;
CREATE TRIGGER trg_job_postings_admin_cols BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION public.enforce_job_postings_admin_cols();

-- Noir drivers
CREATE OR REPLACE FUNCTION public.enforce_noir_drivers_admin_cols()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.is_approved := OLD.is_approved;
  NEW.is_active := OLD.is_active;
  NEW.application_status := OLD.application_status;
  NEW.reviewed_at := OLD.reviewed_at;
  NEW.reviewed_by := OLD.reviewed_by;
  NEW.rejection_reason := OLD.rejection_reason;
  NEW.admin_notes := OLD.admin_notes;
  NEW.rating_average := OLD.rating_average;
  NEW.total_rides := OLD.total_rides;
  NEW.total_earnings := OLD.total_earnings;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_noir_drivers_admin_cols ON public.noir_drivers;
CREATE TRIGGER trg_noir_drivers_admin_cols BEFORE UPDATE ON public.noir_drivers
  FOR EACH ROW EXECUTE FUNCTION public.enforce_noir_drivers_admin_cols();

-- Sales agent applications
CREATE OR REPLACE FUNCTION public.enforce_sales_agent_apps_admin_cols()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.test_score := OLD.test_score;
  NEW.test_passed := OLD.test_passed;
  NEW.application_status := OLD.application_status;
  NEW.reviewed_at := OLD.reviewed_at;
  NEW.reviewed_by := OLD.reviewed_by;
  NEW.notes := OLD.notes;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_sales_agent_apps_admin_cols ON public.sales_agent_applications;
CREATE TRIGGER trg_sales_agent_apps_admin_cols BEFORE UPDATE ON public.sales_agent_applications
  FOR EACH ROW EXECUTE FUNCTION public.enforce_sales_agent_apps_admin_cols();

-- Sponsors
CREATE OR REPLACE FUNCTION public.enforce_sponsors_admin_cols()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.sponsorship_tier := OLD.sponsorship_tier;
  NEW.subscription_status := OLD.subscription_status;
  NEW.subscription_start_date := OLD.subscription_start_date;
  NEW.subscription_end_date := OLD.subscription_end_date;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_sponsors_admin_cols ON public.sponsors;
CREATE TRIGGER trg_sponsors_admin_cols BEFORE UPDATE ON public.sponsors
  FOR EACH ROW EXECUTE FUNCTION public.enforce_sponsors_admin_cols();

-- Vacation properties
CREATE OR REPLACE FUNCTION public.enforce_vacation_properties_admin_cols()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.listing_status := OLD.listing_status;
  NEW.moderation_status := OLD.moderation_status;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_vacation_properties_admin_cols ON public.vacation_properties;
CREATE TRIGGER trg_vacation_properties_admin_cols BEFORE UPDATE ON public.vacation_properties
  FOR EACH ROW EXECUTE FUNCTION public.enforce_vacation_properties_admin_cols();
