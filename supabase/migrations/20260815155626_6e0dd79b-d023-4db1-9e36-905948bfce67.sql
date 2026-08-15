-- 1. developer_accounts: lock tier / limits / billing columns to admins
CREATE OR REPLACE FUNCTION public.enforce_developer_accounts_admin_cols_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() OR auth.role() = 'service_role' THEN RETURN NEW; END IF;
  NEW.tier := OLD.tier;
  NEW.status := OLD.status;
  NEW.monthly_cmal_limit := OLD.monthly_cmal_limit;
  NEW.monthly_voice_limit := OLD.monthly_voice_limit;
  NEW.monthly_susu_limit := OLD.monthly_susu_limit;
  NEW.monthly_fraud_limit := OLD.monthly_fraud_limit;
  NEW.monthly_call_limit := OLD.monthly_call_limit;
  NEW.tier_price_cents := OLD.tier_price_cents;
  NEW.stripe_customer_id := OLD.stripe_customer_id;
  NEW.stripe_subscription_id := OLD.stripe_subscription_id;
  NEW.stripe_subscription_status := OLD.stripe_subscription_status;
  NEW.current_period_end := OLD.current_period_end;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_developer_accounts_admin_cols ON public.developer_accounts;
CREATE TRIGGER trg_developer_accounts_admin_cols BEFORE UPDATE ON public.developer_accounts
FOR EACH ROW EXECUTE FUNCTION public.enforce_developer_accounts_admin_cols_v2();

-- 2. host_verification_requests: force pending on insert, lock review cols on update
CREATE OR REPLACE FUNCTION public.enforce_host_verification_requests_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() OR auth.role() = 'service_role' THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
    NEW.reviewed_by := NULL;
    NEW.reviewed_at := NULL;
    NEW.rejection_reason := NULL;
  ELSE
    NEW.status := OLD.status;
    NEW.reviewed_by := OLD.reviewed_by;
    NEW.reviewed_at := OLD.reviewed_at;
    NEW.rejection_reason := OLD.rejection_reason;
    NEW.expires_at := OLD.expires_at;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_host_verification_requests_cols ON public.host_verification_requests;
CREATE TRIGGER trg_host_verification_requests_cols BEFORE INSERT OR UPDATE ON public.host_verification_requests
FOR EACH ROW EXECUTE FUNCTION public.enforce_host_verification_requests_cols();

-- 3. sales_agent_applications: block self-approval
CREATE OR REPLACE FUNCTION public.enforce_sales_agent_apps_cols_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() OR auth.role() = 'service_role' THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.test_score := NULL;
    NEW.test_passed := false;
    NEW.application_status := 'pending';
    NEW.reviewed_by := NULL;
    NEW.reviewed_at := NULL;
  ELSE
    NEW.test_score := OLD.test_score;
    NEW.test_passed := OLD.test_passed;
    NEW.application_status := OLD.application_status;
    NEW.reviewed_by := OLD.reviewed_by;
    NEW.reviewed_at := OLD.reviewed_at;
    NEW.notes := OLD.notes;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_sales_agent_apps_cols ON public.sales_agent_applications;
CREATE TRIGGER trg_sales_agent_apps_cols BEFORE INSERT OR UPDATE ON public.sales_agent_applications
FOR EACH ROW EXECUTE FUNCTION public.enforce_sales_agent_apps_cols_v2();

-- 4. sponsors: block self-activation of subscription
CREATE OR REPLACE FUNCTION public.enforce_sponsors_cols_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() OR auth.role() = 'service_role' THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.subscription_status := 'pending';
    NEW.subscription_start_date := NULL;
    NEW.subscription_end_date := NULL;
  ELSE
    NEW.subscription_status := OLD.subscription_status;
    NEW.subscription_start_date := OLD.subscription_start_date;
    NEW.subscription_end_date := OLD.subscription_end_date;
    NEW.sponsorship_tier := OLD.sponsorship_tier;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_sponsors_cols ON public.sponsors;
CREATE TRIGGER trg_sponsors_cols BEFORE INSERT OR UPDATE ON public.sponsors
FOR EACH ROW EXECUTE FUNCTION public.enforce_sponsors_cols_v2();

-- 5. stays_id_verification: users cannot self-verify
CREATE OR REPLACE FUNCTION public.enforce_stays_id_verification_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_secure() OR auth.role() = 'service_role' THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.verification_status := 'pending';
    NEW.verified_at := NULL;
    NEW.expires_at := NULL;
    NEW.rejection_reason := NULL;
  ELSE
    NEW.verification_status := OLD.verification_status;
    NEW.verified_at := OLD.verified_at;
    NEW.expires_at := OLD.expires_at;
    NEW.rejection_reason := OLD.rejection_reason;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_stays_id_verification_cols ON public.stays_id_verification;
CREATE TRIGGER trg_stays_id_verification_cols BEFORE INSERT OR UPDATE ON public.stays_id_verification
FOR EACH ROW EXECUTE FUNCTION public.enforce_stays_id_verification_cols();

REVOKE ALL ON FUNCTION public.enforce_developer_accounts_admin_cols_v2() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.enforce_host_verification_requests_cols() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.enforce_sales_agent_apps_cols_v2() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.enforce_sponsors_cols_v2() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.enforce_stays_id_verification_cols() FROM PUBLIC, anon;