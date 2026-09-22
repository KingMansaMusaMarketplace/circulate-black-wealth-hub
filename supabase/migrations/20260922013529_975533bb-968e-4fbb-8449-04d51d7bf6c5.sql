CREATE OR REPLACE FUNCTION public.zzzz_lock_job_posting_payment_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  NEW.status := OLD.status;
  NEW.paid_at := OLD.paid_at;
  NEW.amount_cents := OLD.amount_cents;
  NEW.expires_at := OLD.expires_at;
  NEW.rejection_reason := OLD.rejection_reason;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS zzzz_lock_job_posting_payment_cols ON public.job_postings;
CREATE TRIGGER zzzz_lock_job_posting_payment_cols
BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.zzzz_lock_job_posting_payment_cols();
REVOKE EXECUTE ON FUNCTION public.zzzz_lock_job_posting_payment_cols() FROM public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.zzzz_lock_lease_payment_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  NEW.status := OLD.status;
  NEW.monthly_rent := OLD.monthly_rent;
  NEW.fee_amount := OLD.fee_amount;
  NEW.fee_currency := OLD.fee_currency;
  NEW.fee_charged_at := OLD.fee_charged_at;
  NEW.stripe_payment_intent_id := OLD.stripe_payment_intent_id;
  NEW.stripe_checkout_session_id := OLD.stripe_checkout_session_id;
  NEW.stripe_refund_id := OLD.stripe_refund_id;
  NEW.refund_eligible_until := OLD.refund_eligible_until;
  NEW.refunded_at := OLD.refunded_at;
  NEW.confirmed_at := OLD.confirmed_at;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS zzzz_lock_lease_payment_cols ON public.lease_agreements;
CREATE TRIGGER zzzz_lock_lease_payment_cols
BEFORE UPDATE ON public.lease_agreements
FOR EACH ROW EXECUTE FUNCTION public.zzzz_lock_lease_payment_cols();
REVOKE EXECUTE ON FUNCTION public.zzzz_lock_lease_payment_cols() FROM public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.zzzz_lock_vacation_booking_money_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;
  -- Guests may only cancel; every money/payment field stays as-is
  IF NOT (NEW.status = 'cancelled' AND OLD.status IN ('pending','confirmed')) THEN
    NEW.status := OLD.status;
  END IF;
  NEW.nightly_rate := OLD.nightly_rate;
  NEW.cleaning_fee := OLD.cleaning_fee;
  NEW.pet_fee := OLD.pet_fee;
  NEW.subtotal := OLD.subtotal;
  NEW.platform_fee := OLD.platform_fee;
  NEW.host_payout := OLD.host_payout;
  NEW.total_amount := OLD.total_amount;
  NEW.payment_intent_id := OLD.payment_intent_id;
  NEW.stripe_charge_id := OLD.stripe_charge_id;
  NEW.payout_status := OLD.payout_status;
  NEW.payout_date := OLD.payout_date;
  NEW.refund_amount := OLD.refund_amount;
  NEW.refund_status := OLD.refund_status;
  NEW.refund_id := OLD.refund_id;
  NEW.refunded_at := OLD.refunded_at;
  NEW.confirmed_at := OLD.confirmed_at;
  NEW.admin_notes := OLD.admin_notes;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS zzzz_lock_vacation_booking_money_cols ON public.vacation_bookings;
CREATE TRIGGER zzzz_lock_vacation_booking_money_cols
BEFORE UPDATE ON public.vacation_bookings
FOR EACH ROW EXECUTE FUNCTION public.zzzz_lock_vacation_booking_money_cols();
REVOKE EXECUTE ON FUNCTION public.zzzz_lock_vacation_booking_money_cols() FROM public, anon, authenticated;