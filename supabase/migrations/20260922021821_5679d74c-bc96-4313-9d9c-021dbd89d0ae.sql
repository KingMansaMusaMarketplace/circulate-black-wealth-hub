-- Shared privileged-writer check (admin or service role)
CREATE OR REPLACE FUNCTION public.sec_privileged_writer()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.role() = 'service_role' THEN RETURN true; END IF;
  IF auth.uid() IS NULL THEN RETURN true; END IF; -- server-side/no JWT context
  RETURN public.has_role(auth.uid(), 'admin'::app_role);
END;
$$;

-- 1) coalition_members: owners may only toggle is_active
CREATE OR REPLACE FUNCTION public.sec_guard_coalition_members()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.sec_privileged_writer() THEN RETURN NEW; END IF;
  IF NEW.business_id IS DISTINCT FROM OLD.business_id
     OR NEW.contribution_rate IS DISTINCT FROM OLD.contribution_rate
     OR NEW.redemption_rate IS DISTINCT FROM OLD.redemption_rate
     OR NEW.total_points_generated IS DISTINCT FROM OLD.total_points_generated
     OR NEW.total_points_redeemed IS DISTINCT FROM OLD.total_points_redeemed
     OR NEW.joined_at IS DISTINCT FROM OLD.joined_at THEN
    RAISE EXCEPTION 'Only administrators may change coalition rates, point totals or ownership'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS zzzz_sec_guard_coalition_members ON public.coalition_members;
CREATE TRIGGER zzzz_sec_guard_coalition_members
BEFORE UPDATE ON public.coalition_members
FOR EACH ROW EXECUTE FUNCTION public.sec_guard_coalition_members();

-- 2) job_postings: posters may not touch payment/status columns
CREATE OR REPLACE FUNCTION public.sec_guard_job_postings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.sec_privileged_writer() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.paid_at IS DISTINCT FROM OLD.paid_at
     OR NEW.amount_cents IS DISTINCT FROM OLD.amount_cents
     OR NEW.expires_at IS DISTINCT FROM OLD.expires_at
     OR NEW.poster_user_id IS DISTINCT FROM OLD.poster_user_id THEN
    RAISE EXCEPTION 'Only administrators or the payment system may change job status, payment or expiry'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS zzzz_sec_guard_job_postings ON public.job_postings;
CREATE TRIGGER zzzz_sec_guard_job_postings
BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.sec_guard_job_postings();

-- 3) lease_agreements: landlord/tenant may not confirm or change money fields
CREATE OR REPLACE FUNCTION public.sec_guard_lease_agreements()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.sec_privileged_writer() THEN RETURN NEW; END IF;
  IF NEW.monthly_rent IS DISTINCT FROM OLD.monthly_rent
     OR NEW.fee_amount IS DISTINCT FROM OLD.fee_amount
     OR NEW.fee_currency IS DISTINCT FROM OLD.fee_currency
     OR NEW.fee_charged_at IS DISTINCT FROM OLD.fee_charged_at
     OR NEW.landlord_confirmed_at IS DISTINCT FROM OLD.landlord_confirmed_at
     OR NEW.tenant_confirmed_at IS DISTINCT FROM OLD.tenant_confirmed_at
     OR NEW.confirmed_at IS DISTINCT FROM OLD.confirmed_at
     OR NEW.stripe_payment_intent_id IS DISTINCT FROM OLD.stripe_payment_intent_id
     OR NEW.stripe_checkout_session_id IS DISTINCT FROM OLD.stripe_checkout_session_id
     OR NEW.stripe_refund_id IS DISTINCT FROM OLD.stripe_refund_id
     OR NEW.refunded_at IS DISTINCT FROM OLD.refunded_at
     OR NEW.refund_eligible_until IS DISTINCT FROM OLD.refund_eligible_until
     OR NEW.tenant_confirm_token IS DISTINCT FROM OLD.tenant_confirm_token
     OR NEW.landlord_id IS DISTINCT FROM OLD.landlord_id
     OR NEW.tenant_id IS DISTINCT FROM OLD.tenant_id THEN
    RAISE EXCEPTION 'Only administrators or the payment system may change lease confirmation or payment fields'
      USING ERRCODE = '42501';
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelled' THEN
    RAISE EXCEPTION 'Lease status may only be changed to cancelled by landlord or tenant'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS zzzz_sec_guard_lease_agreements ON public.lease_agreements;
CREATE TRIGGER zzzz_sec_guard_lease_agreements
BEFORE UPDATE ON public.lease_agreements
FOR EACH ROW EXECUTE FUNCTION public.sec_guard_lease_agreements();

REVOKE EXECUTE ON FUNCTION public.sec_privileged_writer() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sec_guard_coalition_members() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sec_guard_job_postings() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sec_guard_lease_agreements() FROM PUBLIC, anon, authenticated;