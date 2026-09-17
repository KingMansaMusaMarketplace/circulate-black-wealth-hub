
CREATE OR REPLACE FUNCTION public.protect_developer_accounts_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.tier := OLD.tier;
    NEW.tier_price_cents := OLD.tier_price_cents;
    NEW.status := OLD.status;
    NEW.stripe_customer_id := OLD.stripe_customer_id;
    NEW.stripe_subscription_id := OLD.stripe_subscription_id;
    NEW.stripe_subscription_status := OLD.stripe_subscription_status;
    NEW.current_period_end := OLD.current_period_end;
    NEW.monthly_cmal_limit := OLD.monthly_cmal_limit;
    NEW.monthly_voice_limit := OLD.monthly_voice_limit;
    NEW.monthly_susu_limit := OLD.monthly_susu_limit;
    NEW.monthly_fraud_limit := OLD.monthly_fraud_limit;
    NEW.monthly_call_limit := OLD.monthly_call_limit;
  END IF;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.protect_developer_accounts_privileged_columns() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS protect_developer_accounts_privileged_columns ON public.developer_accounts;
CREATE TRIGGER protect_developer_accounts_privileged_columns
BEFORE UPDATE ON public.developer_accounts
FOR EACH ROW EXECUTE FUNCTION public.protect_developer_accounts_privileged_columns();

CREATE OR REPLACE FUNCTION public.protect_api_keys_privileged_columns()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_privileged_writer() THEN
    NEW.scopes := OLD.scopes;
    NEW.rate_limit_per_minute := OLD.rate_limit_per_minute;
    NEW.key_hash := OLD.key_hash;
    NEW.key_prefix := OLD.key_prefix;
    NEW.developer_id := OLD.developer_id;
    NEW.environment := OLD.environment;
  END IF;
  RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.protect_api_keys_privileged_columns() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS protect_api_keys_privileged_columns ON public.api_keys;
CREATE TRIGGER protect_api_keys_privileged_columns
BEFORE UPDATE ON public.api_keys
FOR EACH ROW EXECUTE FUNCTION public.protect_api_keys_privileged_columns();
