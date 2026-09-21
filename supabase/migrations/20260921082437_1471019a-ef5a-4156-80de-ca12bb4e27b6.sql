-- Job postings: prevent posters from creating an already-active / already-paid listing
CREATE OR REPLACE FUNCTION public.enforce_job_postings_insert_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.status := 'pending_payment';
  NEW.paid_at := NULL;
  NEW.expires_at := NULL;
  NEW.rejection_reason := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_job_postings_insert_cols ON public.job_postings;
CREATE TRIGGER trg_job_postings_insert_cols
BEFORE INSERT ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.enforce_job_postings_insert_cols();

REVOKE ALL ON FUNCTION public.enforce_job_postings_insert_cols() FROM PUBLIC, anon, authenticated;

-- Lease agreements: prevent landlords from creating a pre-confirmed / pre-paid lease
CREATE OR REPLACE FUNCTION public.enforce_lease_agreements_insert_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.status IS DISTINCT FROM 'pending' THEN
    NEW.status := 'pending';
  END IF;
  NEW.fee_charged_at             := NULL;
  NEW.confirmed_at               := NULL;
  NEW.tenant_confirmed_at        := NULL;
  NEW.stripe_payment_intent_id   := NULL;
  NEW.stripe_checkout_session_id := NULL;
  NEW.stripe_refund_id           := NULL;
  NEW.refunded_at                := NULL;
  NEW.refund_eligible_until      := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lease_agreements_insert_cols ON public.lease_agreements;
CREATE TRIGGER trg_lease_agreements_insert_cols
BEFORE INSERT ON public.lease_agreements
FOR EACH ROW EXECUTE FUNCTION public.enforce_lease_agreements_insert_cols();

REVOKE ALL ON FUNCTION public.enforce_lease_agreements_insert_cols() FROM PUBLIC, anon, authenticated;

-- Sponsors: also pin the tier on self-service inserts (status already forced to 'pending')
CREATE OR REPLACE FUNCTION public.enforce_sponsors_cols_v2()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
END;
$$;