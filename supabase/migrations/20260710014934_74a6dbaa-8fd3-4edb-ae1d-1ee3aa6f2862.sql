
-- Helper: check if current context is admin/service role
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
END;
$$;

-- ============ corporate_subscriptions ============
CREATE OR REPLACE FUNCTION public.protect_corporate_subscription_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.tier := OLD.tier;
  NEW.status := OLD.status;
  NEW.approval_status := OLD.approval_status;
  NEW.stripe_customer_id := OLD.stripe_customer_id;
  NEW.stripe_subscription_id := OLD.stripe_subscription_id;
  NEW.stripe_price_id := OLD.stripe_price_id;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_corporate_subscription_fields_trg ON public.corporate_subscriptions;
CREATE TRIGGER protect_corporate_subscription_fields_trg
BEFORE UPDATE ON public.corporate_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.protect_corporate_subscription_fields();

-- ============ directory_partners ============
CREATE OR REPLACE FUNCTION public.protect_directory_partner_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.commission_tier := OLD.commission_tier;
  NEW.revenue_share_percent := OLD.revenue_share_percent;
  NEW.flat_fee_per_signup := OLD.flat_fee_per_signup;
  NEW.total_earnings := OLD.total_earnings;
  NEW.status := OLD.status;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_directory_partner_fields_trg ON public.directory_partners;
CREATE TRIGGER protect_directory_partner_fields_trg
BEFORE UPDATE ON public.directory_partners
FOR EACH ROW EXECUTE FUNCTION public.protect_directory_partner_fields();

-- ============ noir_drivers ============
CREATE OR REPLACE FUNCTION public.protect_noir_driver_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.is_approved := OLD.is_approved;
  NEW.is_active := OLD.is_active;
  NEW.application_status := OLD.application_status;
  NEW.rating_average := OLD.rating_average;
  NEW.total_earnings := OLD.total_earnings;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_noir_driver_fields_trg ON public.noir_drivers;
CREATE TRIGGER protect_noir_driver_fields_trg
BEFORE UPDATE ON public.noir_drivers
FOR EACH ROW EXECUTE FUNCTION public.protect_noir_driver_fields();

-- ============ sales_agent_applications ============
CREATE OR REPLACE FUNCTION public.protect_sales_agent_application_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.application_status := OLD.application_status;
  NEW.test_passed := OLD.test_passed;
  NEW.test_score := OLD.test_score;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_sales_agent_application_fields_trg ON public.sales_agent_applications;
CREATE TRIGGER protect_sales_agent_application_fields_trg
BEFORE UPDATE ON public.sales_agent_applications
FOR EACH ROW EXECUTE FUNCTION public.protect_sales_agent_application_fields();

-- ============ sales_agents ============
CREATE OR REPLACE FUNCTION public.protect_sales_agent_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.commission_rate := OLD.commission_rate;
  NEW.tier := OLD.tier;
  NEW.total_earned := OLD.total_earned;
  NEW.total_pending := OLD.total_pending;
  NEW.is_active := OLD.is_active;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_sales_agent_fields_trg ON public.sales_agents;
CREATE TRIGGER protect_sales_agent_fields_trg
BEFORE UPDATE ON public.sales_agents
FOR EACH ROW EXECUTE FUNCTION public.protect_sales_agent_fields();

-- ============ sponsors ============
CREATE OR REPLACE FUNCTION public.protect_sponsor_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.sponsorship_tier := OLD.sponsorship_tier;
  NEW.subscription_status := OLD.subscription_status;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_sponsor_fields_trg ON public.sponsors;
CREATE TRIGGER protect_sponsor_fields_trg
BEFORE UPDATE ON public.sponsors
FOR EACH ROW EXECUTE FUNCTION public.protect_sponsor_fields();
