
CREATE OR REPLACE FUNCTION public.is_privileged_writer()
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN true; END IF;              -- service role / backend
  IF current_setting('role', true) = 'service_role' THEN RETURN true; END IF;
  RETURN public.has_role(auth.uid(), 'admin');
END;
$$;

-- 1. sales_agent_applications
CREATE OR REPLACE FUNCTION public.protect_sales_agent_application_fields()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_privileged_writer() THEN RETURN NEW; END IF;
  NEW.application_status := OLD.application_status;
  NEW.test_score         := OLD.test_score;
  NEW.test_passed        := OLD.test_passed;
  NEW.reviewed_at        := OLD.reviewed_at;
  NEW.reviewed_by        := OLD.reviewed_by;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_protect_sales_agent_application_fields ON public.sales_agent_applications;
CREATE TRIGGER trg_protect_sales_agent_application_fields
BEFORE UPDATE ON public.sales_agent_applications
FOR EACH ROW EXECUTE FUNCTION public.protect_sales_agent_application_fields();

-- 2. job_postings
CREATE OR REPLACE FUNCTION public.protect_job_posting_fields()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_privileged_writer() THEN RETURN NEW; END IF;
  NEW.status           := OLD.status;
  NEW.amount_cents     := OLD.amount_cents;
  NEW.paid_at          := OLD.paid_at;
  NEW.expires_at       := OLD.expires_at;
  NEW.rejection_reason := OLD.rejection_reason;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_protect_job_posting_fields ON public.job_postings;
CREATE TRIGGER trg_protect_job_posting_fields
BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.protect_job_posting_fields();

-- 3. lease_agreements
CREATE OR REPLACE FUNCTION public.protect_lease_agreement_fields()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_privileged_writer() THEN RETURN NEW; END IF;
  NEW.status                     := OLD.status;
  NEW.monthly_rent               := OLD.monthly_rent;
  NEW.fee_amount                 := OLD.fee_amount;
  NEW.fee_currency               := OLD.fee_currency;
  NEW.fee_charged_at             := OLD.fee_charged_at;
  NEW.landlord_confirmed_at      := OLD.landlord_confirmed_at;
  NEW.tenant_confirmed_at        := OLD.tenant_confirmed_at;
  NEW.confirmed_at               := OLD.confirmed_at;
  NEW.stripe_payment_intent_id   := OLD.stripe_payment_intent_id;
  NEW.stripe_checkout_session_id := OLD.stripe_checkout_session_id;
  NEW.stripe_refund_id           := OLD.stripe_refund_id;
  NEW.refunded_at                := OLD.refunded_at;
  NEW.refund_eligible_until      := OLD.refund_eligible_until;
  NEW.tenant_confirm_token       := OLD.tenant_confirm_token;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_protect_lease_agreement_fields ON public.lease_agreements;
CREATE TRIGGER trg_protect_lease_agreement_fields
BEFORE UPDATE ON public.lease_agreements
FOR EACH ROW EXECUTE FUNCTION public.protect_lease_agreement_fields();

-- 4. vacation_bookings (guest may still cancel their own booking)
CREATE OR REPLACE FUNCTION public.protect_vacation_booking_fields()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_privileged_writer() THEN RETURN NEW; END IF;
  IF NOT (NEW.status = 'cancelled' AND OLD.status IN ('pending','confirmed')) THEN
    NEW.status := OLD.status;
  END IF;
  NEW.nightly_rate      := OLD.nightly_rate;
  NEW.cleaning_fee      := OLD.cleaning_fee;
  NEW.pet_fee           := OLD.pet_fee;
  NEW.subtotal          := OLD.subtotal;
  NEW.platform_fee      := OLD.platform_fee;
  NEW.host_payout       := OLD.host_payout;
  NEW.total_amount      := OLD.total_amount;
  NEW.payment_intent_id := OLD.payment_intent_id;
  NEW.stripe_charge_id  := OLD.stripe_charge_id;
  NEW.payout_status     := OLD.payout_status;
  NEW.payout_date       := OLD.payout_date;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_protect_vacation_booking_fields ON public.vacation_bookings;
CREATE TRIGGER trg_protect_vacation_booking_fields
BEFORE UPDATE ON public.vacation_bookings
FOR EACH ROW EXECUTE FUNCTION public.protect_vacation_booking_fields();

REVOKE ALL ON FUNCTION public.is_privileged_writer() FROM PUBLIC, anon;
