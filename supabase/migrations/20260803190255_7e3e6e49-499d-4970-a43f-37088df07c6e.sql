CREATE OR REPLACE FUNCTION public.protect_lease_agreements_privileged_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;

  IF NEW.fee_amount IS DISTINCT FROM OLD.fee_amount
     OR NEW.fee_currency IS DISTINCT FROM OLD.fee_currency
     OR NEW.fee_charged_at IS DISTINCT FROM OLD.fee_charged_at
     OR NEW.stripe_payment_intent_id IS DISTINCT FROM OLD.stripe_payment_intent_id
     OR NEW.stripe_checkout_session_id IS DISTINCT FROM OLD.stripe_checkout_session_id
     OR NEW.stripe_refund_id IS DISTINCT FROM OLD.stripe_refund_id
     OR NEW.refunded_at IS DISTINCT FROM OLD.refunded_at
     OR NEW.refund_eligible_until IS DISTINCT FROM OLD.refund_eligible_until
     OR NEW.tenant_confirmed_at IS DISTINCT FROM OLD.tenant_confirmed_at
     OR NEW.confirmed_at IS DISTINCT FROM OLD.confirmed_at
     OR NEW.tenant_confirm_token IS DISTINCT FROM OLD.tenant_confirm_token THEN
    RAISE EXCEPTION 'Not authorized to modify lease fee/payment fields';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Not authorized to change lease status';
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_protect_lease_agreements_privileged_cols ON public.lease_agreements;
CREATE TRIGGER trg_protect_lease_agreements_privileged_cols
BEFORE UPDATE ON public.lease_agreements
FOR EACH ROW EXECUTE FUNCTION public.protect_lease_agreements_privileged_cols();