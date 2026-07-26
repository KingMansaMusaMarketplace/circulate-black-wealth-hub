
-- developer_accounts protection
CREATE OR REPLACE FUNCTION public.protect_developer_accounts_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  IF NEW.tier IS DISTINCT FROM OLD.tier
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.monthly_call_limit IS DISTINCT FROM OLD.monthly_call_limit
     OR NEW.monthly_cmal_limit IS DISTINCT FROM OLD.monthly_cmal_limit
     OR NEW.monthly_voice_limit IS DISTINCT FROM OLD.monthly_voice_limit
     OR NEW.monthly_susu_limit IS DISTINCT FROM OLD.monthly_susu_limit
     OR NEW.monthly_fraud_limit IS DISTINCT FROM OLD.monthly_fraud_limit
     OR NEW.stripe_subscription_status IS DISTINCT FROM OLD.stripe_subscription_status
  THEN
    RAISE EXCEPTION 'Only administrators can modify tier, status, limits, or subscription status on developer_accounts';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_developer_accounts_privileged ON public.developer_accounts;
CREATE TRIGGER protect_developer_accounts_privileged
BEFORE UPDATE ON public.developer_accounts
FOR EACH ROW EXECUTE FUNCTION public.protect_developer_accounts_privileged_fields();

-- api_keys protection
CREATE OR REPLACE FUNCTION public.protect_api_keys_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  IF NEW.scopes IS DISTINCT FROM OLD.scopes
     OR NEW.rate_limit_per_minute IS DISTINCT FROM OLD.rate_limit_per_minute
     OR NEW.environment IS DISTINCT FROM OLD.environment
     OR NEW.key_hash IS DISTINCT FROM OLD.key_hash
     OR NEW.key_prefix IS DISTINCT FROM OLD.key_prefix
     OR NEW.developer_id IS DISTINCT FROM OLD.developer_id
  THEN
    RAISE EXCEPTION 'Only administrators can modify scopes, rate limits, environment, or key identity on api_keys';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_api_keys_privileged ON public.api_keys;
CREATE TRIGGER protect_api_keys_privileged
BEFORE UPDATE ON public.api_keys
FOR EACH ROW EXECUTE FUNCTION public.protect_api_keys_privileged_fields();

-- sponsors protection
CREATE OR REPLACE FUNCTION public.protect_sponsors_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_secure() THEN
    RETURN NEW;
  END IF;

  IF NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.sponsorship_tier IS DISTINCT FROM OLD.sponsorship_tier
     OR NEW.subscription_start_date IS DISTINCT FROM OLD.subscription_start_date
     OR NEW.subscription_end_date IS DISTINCT FROM OLD.subscription_end_date
  THEN
    RAISE EXCEPTION 'Only administrators can modify subscription status, tier, or subscription dates on sponsors';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_sponsors_privileged ON public.sponsors;
CREATE TRIGGER protect_sponsors_privileged
BEFORE UPDATE ON public.sponsors
FOR EACH ROW EXECUTE FUNCTION public.protect_sponsors_privileged_fields();
