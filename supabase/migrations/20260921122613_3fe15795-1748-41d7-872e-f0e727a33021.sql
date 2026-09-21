CREATE OR REPLACE FUNCTION public.zzz_lock_lease_fee_and_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Service role (Stripe webhooks / backend) and admins may change anything.
  IF (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
     OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Everyone else (including the landlord) cannot self-confirm a lease,
  -- mark the platform fee as charged, or attach Stripe references.
  NEW.status                      := OLD.status;
  NEW.fee_charged_at              := OLD.fee_charged_at;
  NEW.stripe_payment_intent_id    := OLD.stripe_payment_intent_id;
  NEW.stripe_checkout_session_id  := OLD.stripe_checkout_session_id;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.zzz_lock_lease_fee_and_status() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS zzz_lock_lease_fee_and_status ON public.lease_agreements;
CREATE TRIGGER zzz_lock_lease_fee_and_status
BEFORE UPDATE ON public.lease_agreements
FOR EACH ROW EXECUTE FUNCTION public.zzz_lock_lease_fee_and_status();