
-- Helper: check if current context is admin or service_role
CREATE OR REPLACE FUNCTION public.is_admin_or_service()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('role', true) = 'service_role' THEN
    RETURN true;
  END IF;
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  RETURN public.has_role(auth.uid(), 'admin'::app_role);
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$;

-- 1. corporate_subscriptions
CREATE OR REPLACE FUNCTION public.protect_corporate_subscriptions_privileged()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.approval_status IS DISTINCT FROM OLD.approval_status
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.is_founding_sponsor IS DISTINCT FROM OLD.is_founding_sponsor
     OR NEW.featured_until IS DISTINCT FROM OLD.featured_until
     OR NEW.display_priority IS DISTINCT FROM OLD.display_priority
     OR NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id
     OR NEW.stripe_subscription_id IS DISTINCT FROM OLD.stripe_subscription_id
  THEN
    RAISE EXCEPTION 'Not authorized to modify privileged sponsor fields';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_corporate_subscriptions ON public.corporate_subscriptions;
CREATE TRIGGER trg_protect_corporate_subscriptions
BEFORE UPDATE ON public.corporate_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.protect_corporate_subscriptions_privileged();

-- 2. directory_partners
CREATE OR REPLACE FUNCTION public.protect_directory_partners_privileged()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.commission_tier IS DISTINCT FROM OLD.commission_tier
     OR NEW.revenue_share_percent IS DISTINCT FROM OLD.revenue_share_percent
     OR NEW.flat_fee_per_signup IS DISTINCT FROM OLD.flat_fee_per_signup
     OR NEW.pending_earnings IS DISTINCT FROM OLD.pending_earnings
     OR NEW.total_earnings IS DISTINCT FROM OLD.total_earnings
     OR NEW.total_referrals IS DISTINCT FROM OLD.total_referrals
     OR NEW.total_conversions IS DISTINCT FROM OLD.total_conversions
     OR NEW.lifetime_referrals IS DISTINCT FROM OLD.lifetime_referrals
     OR NEW.monthly_bonus_earned IS DISTINCT FROM OLD.monthly_bonus_earned
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
  THEN
    RAISE EXCEPTION 'Not authorized to modify privileged partner fields';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_directory_partners ON public.directory_partners;
CREATE TRIGGER trg_protect_directory_partners
BEFORE UPDATE ON public.directory_partners
FOR EACH ROW EXECUTE FUNCTION public.protect_directory_partners_privileged();

-- 3. featured_placements
CREATE OR REPLACE FUNCTION public.protect_featured_placements_privileged()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.priority_score IS DISTINCT FROM OLD.priority_score
  THEN
    RAISE EXCEPTION 'Not authorized to modify featured placement status/tier/priority';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_featured_placements ON public.featured_placements;
CREATE TRIGGER trg_protect_featured_placements
BEFORE UPDATE ON public.featured_placements
FOR EACH ROW EXECUTE FUNCTION public.protect_featured_placements_privileged();

-- 4. job_postings
CREATE OR REPLACE FUNCTION public.protect_job_postings_privileged()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.paid_at IS DISTINCT FROM OLD.paid_at
     OR NEW.amount_cents IS DISTINCT FROM OLD.amount_cents
  THEN
    RAISE EXCEPTION 'Not authorized to modify job posting payment/status fields';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_job_postings ON public.job_postings;
CREATE TRIGGER trg_protect_job_postings
BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.protect_job_postings_privileged();

-- 5. noir_drivers
CREATE OR REPLACE FUNCTION public.protect_noir_drivers_privileged()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.application_status IS DISTINCT FROM OLD.application_status
     OR NEW.total_earnings IS DISTINCT FROM OLD.total_earnings
     OR NEW.rating_average IS DISTINCT FROM OLD.rating_average
  THEN
    RAISE EXCEPTION 'Not authorized to modify driver approval/earnings/rating fields';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_noir_drivers ON public.noir_drivers;
CREATE TRIGGER trg_protect_noir_drivers
BEFORE UPDATE ON public.noir_drivers
FOR EACH ROW EXECUTE FUNCTION public.protect_noir_drivers_privileged();

-- 6. sales_agents
CREATE OR REPLACE FUNCTION public.protect_sales_agents_privileged()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.commission_rate IS DISTINCT FROM OLD.commission_rate
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.total_earned IS DISTINCT FROM OLD.total_earned
     OR NEW.total_pending IS DISTINCT FROM OLD.total_pending
     OR NEW.is_active IS DISTINCT FROM OLD.is_active
     OR NEW.lifetime_referrals IS DISTINCT FROM OLD.lifetime_referrals
  THEN
    RAISE EXCEPTION 'Not authorized to modify sales agent commission/earnings/status fields';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_sales_agents ON public.sales_agents;
CREATE TRIGGER trg_protect_sales_agents
BEFORE UPDATE ON public.sales_agents
FOR EACH ROW EXECUTE FUNCTION public.protect_sales_agents_privileged();

-- 7. vacation_properties
CREATE OR REPLACE FUNCTION public.protect_vacation_properties_privileged()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.listing_status IS DISTINCT FROM OLD.listing_status
     OR NEW.moderation_status IS DISTINCT FROM OLD.moderation_status
  THEN
    RAISE EXCEPTION 'Not authorized to modify verification/moderation/listing status fields';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_vacation_properties ON public.vacation_properties;
CREATE TRIGGER trg_protect_vacation_properties
BEFORE UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.protect_vacation_properties_privileged();
