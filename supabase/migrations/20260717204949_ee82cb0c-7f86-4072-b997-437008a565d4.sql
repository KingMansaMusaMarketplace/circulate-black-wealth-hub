
CREATE OR REPLACE FUNCTION public.protect_sales_agent_application_fields()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  IF NEW.application_status IS DISTINCT FROM OLD.application_status
     OR NEW.test_passed IS DISTINCT FROM OLD.test_passed
     OR NEW.test_score  IS DISTINCT FROM OLD.test_score
     OR NEW.reviewed_at  IS DISTINCT FROM OLD.reviewed_at
     OR NEW.reviewed_by  IS DISTINCT FROM OLD.reviewed_by THEN
    RAISE EXCEPTION 'Only admins can modify review/status/test fields';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_protect_sales_agent_application_fields ON public.sales_agent_applications;
CREATE TRIGGER trg_protect_sales_agent_application_fields
BEFORE UPDATE ON public.sales_agent_applications
FOR EACH ROW EXECUTE FUNCTION public.protect_sales_agent_application_fields();

DROP POLICY IF EXISTS "Anyone can submit hotel partner application" ON public.noir_hotel_partners;
CREATE POLICY "Authenticated users can submit hotel partner application"
ON public.noir_hotel_partners FOR INSERT TO authenticated
WITH CHECK (status = 'pending');

REVOKE SELECT (ip_address, user_agent) ON public.partner_link_clicks FROM authenticated;
REVOKE SELECT (ip_address, user_agent) ON public.partner_link_clicks FROM anon;

CREATE OR REPLACE FUNCTION public.protect_profiles_privileged_fields()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() THEN RETURN NEW; END IF;
  IF NEW.wallet_balance IS DISTINCT FROM OLD.wallet_balance
     OR NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.subscription_start_date IS DISTINCT FROM OLD.subscription_start_date
     OR NEW.subscription_end_date IS DISTINCT FROM OLD.subscription_end_date
     OR NEW.user_type IS DISTINCT FROM OLD.user_type
     OR NEW.is_founding_member IS DISTINCT FROM OLD.is_founding_member THEN
    RAISE EXCEPTION 'Only admins can modify privileged profile fields';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_protect_profiles_privileged_fields ON public.profiles;
CREATE TRIGGER trg_protect_profiles_privileged_fields
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profiles_privileged_fields();
