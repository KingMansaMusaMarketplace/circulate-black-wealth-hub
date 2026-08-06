CREATE OR REPLACE FUNCTION public.protect_bookings_financial_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;

  -- Payment-derived / immutable fields cannot be changed by business owners or customers
  NEW.amount            := OLD.amount;
  NEW.platform_fee      := OLD.platform_fee;
  NEW.business_amount   := OLD.business_amount;
  NEW.payment_intent_id := OLD.payment_intent_id;
  NEW.stripe_charge_id  := OLD.stripe_charge_id;
  NEW.business_id       := OLD.business_id;
  NEW.customer_id       := OLD.customer_id;
  NEW.service_id        := OLD.service_id;
  NEW.duration_minutes  := OLD.duration_minutes;
  NEW.created_at        := OLD.created_at;

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.protect_bookings_financial_cols() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_protect_bookings_financial_cols ON public.bookings;
CREATE TRIGGER trg_protect_bookings_financial_cols
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.protect_bookings_financial_cols();