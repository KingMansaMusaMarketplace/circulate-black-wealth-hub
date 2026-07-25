
-- Helper: is caller admin or system (service_role/cron)
CREATE OR REPLACE FUNCTION public._sec_is_admin_or_system()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    -- service_role / cron / definer contexts
    RETURN true;
  END IF;
  RETURN public.is_admin_secure();
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$;

-- businesses
CREATE OR REPLACE FUNCTION public.protect_businesses_privileged_cols_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.is_founding_member IS DISTINCT FROM OLD.is_founding_member
     OR NEW.founding_order IS DISTINCT FROM OLD.founding_order
     OR NEW.referral_commission_paid IS DISTINCT FROM OLD.referral_commission_paid
     OR NEW.average_rating IS DISTINCT FROM OLD.average_rating
     OR NEW.review_count IS DISTINCT FROM OLD.review_count
     OR NEW.transaction_count IS DISTINCT FROM OLD.transaction_count
     OR NEW.total_revenue_tracked IS DISTINCT FROM OLD.total_revenue_tracked THEN
    RAISE EXCEPTION 'Not authorized to modify privileged business fields';
  END IF;
  -- listing_status: allow owner to move draft->pending only
  IF NEW.listing_status IS DISTINCT FROM OLD.listing_status THEN
    IF NOT (OLD.listing_status IN ('draft','rejected') AND NEW.listing_status = 'pending_review') THEN
      RAISE EXCEPTION 'Not authorized to change listing_status';
    END IF;
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_businesses_privileged_cols_v2 ON public.businesses;
CREATE TRIGGER trg_protect_businesses_privileged_cols_v2
BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.protect_businesses_privileged_cols_v2();

-- corporate_subscriptions
CREATE OR REPLACE FUNCTION public.protect_corporate_subs_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.approval_status IS DISTINCT FROM OLD.approval_status
     OR NEW.is_founding_sponsor IS DISTINCT FROM OLD.is_founding_sponsor
     OR NEW.featured_until IS DISTINCT FROM OLD.featured_until THEN
    RAISE EXCEPTION 'Not authorized to modify sponsor tier/status/approval fields';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_corporate_subs_v2 ON public.corporate_subscriptions;
CREATE TRIGGER trg_protect_corporate_subs_v2
BEFORE UPDATE ON public.corporate_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.protect_corporate_subs_v2();

-- directory_partners
CREATE OR REPLACE FUNCTION public.protect_directory_partners_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.commission_tier IS DISTINCT FROM OLD.commission_tier
     OR NEW.revenue_share_percent IS DISTINCT FROM OLD.revenue_share_percent
     OR NEW.flat_fee_per_signup IS DISTINCT FROM OLD.flat_fee_per_signup
     OR NEW.total_earnings IS DISTINCT FROM OLD.total_earnings
     OR NEW.pending_earnings IS DISTINCT FROM OLD.pending_earnings
     OR NEW.total_referrals IS DISTINCT FROM OLD.total_referrals
     OR NEW.total_conversions IS DISTINCT FROM OLD.total_conversions
     OR NEW.lifetime_referrals IS DISTINCT FROM OLD.lifetime_referrals
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.tier IS DISTINCT FROM OLD.tier THEN
    RAISE EXCEPTION 'Not authorized to modify partner commission/earnings/status fields';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_directory_partners_v2 ON public.directory_partners;
CREATE TRIGGER trg_protect_directory_partners_v2
BEFORE UPDATE ON public.directory_partners
FOR EACH ROW EXECUTE FUNCTION public.protect_directory_partners_v2();

-- featured_placements
CREATE OR REPLACE FUNCTION public.protect_featured_placements_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.priority_score IS DISTINCT FROM OLD.priority_score THEN
    RAISE EXCEPTION 'Not authorized to modify placement status/tier/priority';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_featured_placements_v2 ON public.featured_placements;
CREATE TRIGGER trg_protect_featured_placements_v2
BEFORE UPDATE ON public.featured_placements
FOR EACH ROW EXECUTE FUNCTION public.protect_featured_placements_v2();

-- job_postings
CREATE OR REPLACE FUNCTION public.protect_job_postings_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Not authorized to modify job posting status';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_job_postings_v2 ON public.job_postings;
CREATE TRIGGER trg_protect_job_postings_v2
BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.protect_job_postings_v2();

-- noir_drivers
CREATE OR REPLACE FUNCTION public.protect_noir_drivers_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    RAISE EXCEPTION 'Not authorized to modify driver approval/active flags';
  END IF;
  IF NEW.application_status IS DISTINCT FROM OLD.application_status THEN
    IF NOT (OLD.application_status = 'draft' AND NEW.application_status = 'submitted') THEN
      RAISE EXCEPTION 'Not authorized to change application_status';
    END IF;
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_noir_drivers_v2 ON public.noir_drivers;
CREATE TRIGGER trg_protect_noir_drivers_v2
BEFORE UPDATE ON public.noir_drivers
FOR EACH ROW EXECUTE FUNCTION public.protect_noir_drivers_v2();

-- profiles: extend to hbcu/badge/referral_tier
CREATE OR REPLACE FUNCTION public.protect_profiles_hbcu_badges_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.is_hbcu_member IS DISTINCT FROM OLD.is_hbcu_member
     OR NEW.hbcu_verification_status IS DISTINCT FROM OLD.hbcu_verification_status
     OR NEW.verification_badges IS DISTINCT FROM OLD.verification_badges
     OR NEW.referral_tier IS DISTINCT FROM OLD.referral_tier THEN
    RAISE EXCEPTION 'Not authorized to modify HBCU/verification/referral_tier fields';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_profiles_hbcu_badges_v2 ON public.profiles;
CREATE TRIGGER trg_protect_profiles_hbcu_badges_v2
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profiles_hbcu_badges_v2();

-- sales_agents
CREATE OR REPLACE FUNCTION public.protect_sales_agents_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.commission_rate IS DISTINCT FROM OLD.commission_rate
     OR NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.total_earned IS DISTINCT FROM OLD.total_earned
     OR NEW.total_pending IS DISTINCT FROM OLD.total_pending
     OR NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    RAISE EXCEPTION 'Not authorized to modify agent commission/tier/totals';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_sales_agents_v2 ON public.sales_agents;
CREATE TRIGGER trg_protect_sales_agents_v2
BEFORE UPDATE ON public.sales_agents
FOR EACH ROW EXECUTE FUNCTION public.protect_sales_agents_v2();

-- user_referrals
CREATE OR REPLACE FUNCTION public.protect_user_referrals_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.points_awarded IS DISTINCT FROM OLD.points_awarded
     OR NEW.cash_awarded IS DISTINCT FROM OLD.cash_awarded THEN
    RAISE EXCEPTION 'Not authorized to modify referral status/rewards';
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_user_referrals_v2 ON public.user_referrals;
CREATE TRIGGER trg_protect_user_referrals_v2
BEFORE UPDATE ON public.user_referrals
FOR EACH ROW EXECUTE FUNCTION public.protect_user_referrals_v2();

-- vacation_properties
CREATE OR REPLACE FUNCTION public.protect_vacation_properties_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.moderation_status IS DISTINCT FROM OLD.moderation_status THEN
    RAISE EXCEPTION 'Not authorized to modify verification/moderation status';
  END IF;
  IF NEW.listing_status IS DISTINCT FROM OLD.listing_status THEN
    IF NOT (OLD.listing_status IN ('draft','rejected') AND NEW.listing_status = 'pending_review') THEN
      RAISE EXCEPTION 'Not authorized to change listing_status';
    END IF;
  END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_protect_vacation_properties_v2 ON public.vacation_properties;
CREATE TRIGGER trg_protect_vacation_properties_v2
BEFORE UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.protect_vacation_properties_v2();
