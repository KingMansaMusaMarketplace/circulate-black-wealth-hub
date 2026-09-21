CREATE OR REPLACE FUNCTION public.enforce_developer_account_insert_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  NEW.tier := 'free'::public.developer_tier;
  NEW.status := 'pending'::public.developer_status;
  NEW.monthly_cmal_limit := 1000;
  NEW.monthly_voice_limit := 100;
  NEW.monthly_susu_limit := 50;
  NEW.monthly_fraud_limit := 100;
  NEW.monthly_call_limit := 1000;
  NEW.tier_price_cents := 0;
  NEW.stripe_customer_id := NULL;
  NEW.stripe_subscription_id := NULL;
  NEW.stripe_subscription_status := NULL;
  NEW.current_period_end := NULL;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_developer_account_insert_defaults() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_developer_account_insert_defaults ON public.developer_accounts;
CREATE TRIGGER trg_enforce_developer_account_insert_defaults
BEFORE INSERT ON public.developer_accounts
FOR EACH ROW EXECUTE FUNCTION public.enforce_developer_account_insert_defaults();

CREATE OR REPLACE FUNCTION public.enforce_profile_insert_defaults()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  NEW.wallet_balance := 0.00;
  NEW.subscription_status := 'active';
  NEW.subscription_tier := 'free'::public.subscription_tier;
  NEW.is_founding_member := false;
  NEW.is_verified_host := false;
  NEW.economic_karma := 100.0;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_profile_insert_defaults() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS a_enforce_profile_insert_defaults ON public.profiles;
CREATE TRIGGER a_enforce_profile_insert_defaults
BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_insert_defaults();