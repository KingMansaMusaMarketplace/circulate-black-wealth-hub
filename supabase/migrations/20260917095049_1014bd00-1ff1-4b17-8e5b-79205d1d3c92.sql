
-- 1) Standardize admin check on b2b_external_leads INSERT
DROP POLICY IF EXISTS "Admins can insert leads" ON public.b2b_external_leads;
CREATE POLICY "Admins can insert leads" ON public.b2b_external_leads
FOR INSERT TO authenticated
WITH CHECK (public.is_admin_secure());

-- Helper: is the current actor privileged (admin user, or trusted server-side context)?
CREATE OR REPLACE FUNCTION public.is_privileged_writer()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- 2) businesses
CREATE OR REPLACE FUNCTION public.protect_businesses_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.is_verified := OLD.is_verified;
    NEW.listing_status := OLD.listing_status;
    NEW.claim_status := OLD.claim_status;
    NEW.subscription_status := OLD.subscription_status;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS protect_businesses_privileged_columns ON public.businesses;
CREATE TRIGGER protect_businesses_privileged_columns
BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.protect_businesses_privileged_columns();

-- 3) sales_agents
CREATE OR REPLACE FUNCTION public.protect_sales_agents_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.commission_rate := OLD.commission_rate;
    NEW.tier := OLD.tier;
    NEW.total_earned := OLD.total_earned;
    NEW.is_active := OLD.is_active;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS protect_sales_agents_privileged_columns ON public.sales_agents;
CREATE TRIGGER protect_sales_agents_privileged_columns
BEFORE UPDATE ON public.sales_agents
FOR EACH ROW EXECUTE FUNCTION public.protect_sales_agents_privileged_columns();

-- 4) corporate_subscriptions
CREATE OR REPLACE FUNCTION public.protect_corporate_subscriptions_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.approval_status := OLD.approval_status;
    NEW.is_visible := OLD.is_visible;
    NEW.display_priority := OLD.display_priority;
    NEW.featured_until := OLD.featured_until;
    NEW.status := OLD.status;
    NEW.tier := OLD.tier;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS protect_corporate_subscriptions_privileged_columns ON public.corporate_subscriptions;
CREATE TRIGGER protect_corporate_subscriptions_privileged_columns
BEFORE UPDATE ON public.corporate_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.protect_corporate_subscriptions_privileged_columns();

-- 5) directory_partners
CREATE OR REPLACE FUNCTION public.protect_directory_partners_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.status := OLD.status;
    NEW.tier := OLD.tier;
    NEW.revenue_share_percent := OLD.revenue_share_percent;
    NEW.total_earnings := OLD.total_earnings;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS protect_directory_partners_privileged_columns ON public.directory_partners;
CREATE TRIGGER protect_directory_partners_privileged_columns
BEFORE UPDATE ON public.directory_partners
FOR EACH ROW EXECUTE FUNCTION public.protect_directory_partners_privileged_columns();

-- 6) featured_placements
CREATE OR REPLACE FUNCTION public.protect_featured_placements_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.tier := OLD.tier;
    NEW.priority_score := OLD.priority_score;
    NEW.status := OLD.status;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS protect_featured_placements_privileged_columns ON public.featured_placements;
CREATE TRIGGER protect_featured_placements_privileged_columns
BEFORE UPDATE ON public.featured_placements
FOR EACH ROW EXECUTE FUNCTION public.protect_featured_placements_privileged_columns();

-- 7) noir_drivers
CREATE OR REPLACE FUNCTION public.protect_noir_drivers_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.is_approved := OLD.is_approved;
    NEW.is_active := OLD.is_active;
    NEW.application_status := OLD.application_status;
    NEW.rating_average := OLD.rating_average;
    NEW.total_earnings := OLD.total_earnings;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS protect_noir_drivers_privileged_columns ON public.noir_drivers;
CREATE TRIGGER protect_noir_drivers_privileged_columns
BEFORE UPDATE ON public.noir_drivers
FOR EACH ROW EXECUTE FUNCTION public.protect_noir_drivers_privileged_columns();

-- 8) vacation_properties
CREATE OR REPLACE FUNCTION public.protect_vacation_properties_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.is_verified := OLD.is_verified;
    NEW.listing_status := OLD.listing_status;
    NEW.moderation_status := OLD.moderation_status;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS protect_vacation_properties_privileged_columns ON public.vacation_properties;
CREATE TRIGGER protect_vacation_properties_privileged_columns
BEFORE UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.protect_vacation_properties_privileged_columns();
