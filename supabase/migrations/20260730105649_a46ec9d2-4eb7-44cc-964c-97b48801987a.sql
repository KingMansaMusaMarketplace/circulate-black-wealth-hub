
-- Generic helper: restore a list of columns from OLD unless caller is admin/service
CREATE OR REPLACE FUNCTION public.enforce_developer_accounts_admin_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.tier := OLD.tier;
  NEW.status := OLD.status;
  NEW.tier_price_cents := OLD.tier_price_cents;
  NEW.monthly_call_limit := OLD.monthly_call_limit;
  NEW.monthly_cmal_limit := OLD.monthly_cmal_limit;
  NEW.monthly_voice_limit := OLD.monthly_voice_limit;
  NEW.monthly_susu_limit := OLD.monthly_susu_limit;
  NEW.monthly_fraud_limit := OLD.monthly_fraud_limit;
  NEW.stripe_subscription_status := OLD.stripe_subscription_status;
  NEW.stripe_subscription_id := OLD.stripe_subscription_id;
  NEW.stripe_customer_id := OLD.stripe_customer_id;
  NEW.current_period_end := OLD.current_period_end;
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS trg_developer_accounts_admin_cols ON public.developer_accounts;
CREATE TRIGGER trg_developer_accounts_admin_cols
BEFORE UPDATE ON public.developer_accounts
FOR EACH ROW EXECUTE FUNCTION public.enforce_developer_accounts_admin_cols();

-- vacation_properties: also protect service_fee_percent
CREATE OR REPLACE FUNCTION public.enforce_vacation_properties_admin_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_old jsonb := to_jsonb(OLD);
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.is_verified := OLD.is_verified;
  NEW.listing_status := OLD.listing_status;
  NEW.moderation_status := OLD.moderation_status;
  IF v_old ? 'service_fee_percent'
     AND (v_old -> 'service_fee_percent') IS DISTINCT FROM (to_jsonb(NEW) -> 'service_fee_percent') THEN
    RAISE EXCEPTION 'Permission denied: service_fee_percent is admin-only' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS trg_vacation_properties_admin_cols ON public.vacation_properties;
CREATE TRIGGER trg_vacation_properties_admin_cols
BEFORE UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.enforce_vacation_properties_admin_cols();

-- vacation_bookings: guests may not touch financial / settlement columns
CREATE OR REPLACE FUNCTION public.enforce_vacation_bookings_financial_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.nightly_rate := OLD.nightly_rate;
  NEW.num_nights := OLD.num_nights;
  NEW.subtotal := OLD.subtotal;
  NEW.cleaning_fee := OLD.cleaning_fee;
  NEW.pet_fee := OLD.pet_fee;
  NEW.platform_fee := OLD.platform_fee;
  NEW.host_payout := OLD.host_payout;
  NEW.total_amount := OLD.total_amount;
  NEW.payout_status := OLD.payout_status;
  NEW.payout_date := OLD.payout_date;
  NEW.refund_amount := OLD.refund_amount;
  NEW.refund_status := OLD.refund_status;
  NEW.refund_id := OLD.refund_id;
  NEW.refunded_at := OLD.refunded_at;
  NEW.payment_intent_id := OLD.payment_intent_id;
  NEW.stripe_charge_id := OLD.stripe_charge_id;
  NEW.admin_notes := OLD.admin_notes;
  NEW.confirmed_at := OLD.confirmed_at;
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS trg_vacation_bookings_financial_cols ON public.vacation_bookings;
CREATE TRIGGER trg_vacation_bookings_financial_cols
BEFORE UPDATE ON public.vacation_bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_vacation_bookings_financial_cols();

REVOKE EXECUTE ON FUNCTION public.enforce_developer_accounts_admin_cols() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.enforce_vacation_properties_admin_cols() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.enforce_vacation_bookings_financial_cols() FROM PUBLIC, anon;
