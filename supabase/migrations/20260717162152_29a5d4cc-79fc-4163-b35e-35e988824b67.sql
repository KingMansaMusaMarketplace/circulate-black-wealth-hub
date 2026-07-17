
-- Helper: check if current user is admin using existing has_role infra
CREATE OR REPLACE FUNCTION public._is_admin_current_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- 1) businesses: protect verification/subscription/listing/founding columns
CREATE OR REPLACE FUNCTION public.protect_businesses_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public._is_admin_current_user() THEN
    RETURN NEW;
  END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.subscription_status := OLD.subscription_status;
  NEW.listing_status := OLD.listing_status;
  NEW.is_founding_sponsor := OLD.is_founding_sponsor;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_businesses_privileged_fields ON public.businesses;
CREATE TRIGGER trg_protect_businesses_privileged_fields
BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.protect_businesses_privileged_fields();

-- 2) directory_partners: protect financial + status columns
CREATE OR REPLACE FUNCTION public.protect_directory_partners_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public._is_admin_current_user() THEN
    RETURN NEW;
  END IF;
  NEW.revenue_share_percent := OLD.revenue_share_percent;
  NEW.flat_fee_per_signup := OLD.flat_fee_per_signup;
  NEW.total_earnings := OLD.total_earnings;
  NEW.pending_earnings := OLD.pending_earnings;
  NEW.total_referrals := OLD.total_referrals;
  NEW.total_conversions := OLD.total_conversions;
  NEW.status := OLD.status;
  NEW.tier := OLD.tier;
  NEW.commission_tier := OLD.commission_tier;
  NEW.approved_at := OLD.approved_at;
  NEW.approved_by := OLD.approved_by;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_directory_partners_privileged_fields ON public.directory_partners;
CREATE TRIGGER trg_protect_directory_partners_privileged_fields
BEFORE UPDATE ON public.directory_partners
FOR EACH ROW EXECUTE FUNCTION public.protect_directory_partners_privileged_fields();

-- 3) noir_drivers: protect approval/status columns
CREATE OR REPLACE FUNCTION public.protect_noir_drivers_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public._is_admin_current_user() THEN
    RETURN NEW;
  END IF;
  NEW.is_approved := OLD.is_approved;
  NEW.is_active := OLD.is_active;
  NEW.application_status := OLD.application_status;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_noir_drivers_privileged_fields ON public.noir_drivers;
CREATE TRIGGER trg_protect_noir_drivers_privileged_fields
BEFORE UPDATE ON public.noir_drivers
FOR EACH ROW EXECUTE FUNCTION public.protect_noir_drivers_privileged_fields();

-- 4) sales_agents: protect commission + earnings columns
CREATE OR REPLACE FUNCTION public.protect_sales_agents_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public._is_admin_current_user() THEN
    RETURN NEW;
  END IF;
  NEW.commission_rate := OLD.commission_rate;
  NEW.tier := OLD.tier;
  NEW.total_earned := OLD.total_earned;
  NEW.total_pending := OLD.total_pending;
  NEW.lifetime_referrals := OLD.lifetime_referrals;
  NEW.is_active := OLD.is_active;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_sales_agents_privileged_fields ON public.sales_agents;
CREATE TRIGGER trg_protect_sales_agents_privileged_fields
BEFORE UPDATE ON public.sales_agents
FOR EACH ROW EXECUTE FUNCTION public.protect_sales_agents_privileged_fields();

-- 5) vacation_properties: protect moderation/verification/listing columns
CREATE OR REPLACE FUNCTION public.protect_vacation_properties_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public._is_admin_current_user() THEN
    RETURN NEW;
  END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.moderation_status := OLD.moderation_status;
  NEW.listing_status := OLD.listing_status;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_vacation_properties_privileged_fields ON public.vacation_properties;
CREATE TRIGGER trg_protect_vacation_properties_privileged_fields
BEFORE UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.protect_vacation_properties_privileged_fields();

-- 6) corporate_subscriptions: protect approval/display fields
CREATE OR REPLACE FUNCTION public.protect_corporate_subscriptions_privileged_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public._is_admin_current_user() THEN
    RETURN NEW;
  END IF;
  NEW.approval_status := OLD.approval_status;
  NEW.is_founding_sponsor := OLD.is_founding_sponsor;
  NEW.display_priority := OLD.display_priority;
  NEW.featured_until := OLD.featured_until;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_corporate_subscriptions_privileged_fields ON public.corporate_subscriptions;
CREATE TRIGGER trg_protect_corporate_subscriptions_privileged_fields
BEFORE UPDATE ON public.corporate_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.protect_corporate_subscriptions_privileged_fields();
