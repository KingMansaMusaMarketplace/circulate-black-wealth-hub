
-- 1. Job postings: freeze paid/status columns for non-admins
CREATE OR REPLACE FUNCTION public.zz_guard_job_postings_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.status       := OLD.status;
  NEW.paid_at      := OLD.paid_at;
  NEW.amount_cents := OLD.amount_cents;
  NEW.expires_at   := OLD.expires_at;
  NEW.poster_user_id := OLD.poster_user_id;
  RETURN NEW;
END;$$;
REVOKE EXECUTE ON FUNCTION public.zz_guard_job_postings_cols() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS zz_guard_job_postings_cols ON public.job_postings;
CREATE TRIGGER zz_guard_job_postings_cols BEFORE UPDATE ON public.job_postings
FOR EACH ROW EXECUTE FUNCTION public.zz_guard_job_postings_cols();

-- 2. Lease agreements: landlords cannot touch payment columns
CREATE OR REPLACE FUNCTION public.zz_guard_lease_agreements_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  NEW.fee_amount                 := OLD.fee_amount;
  NEW.fee_currency               := OLD.fee_currency;
  NEW.fee_charged_at             := OLD.fee_charged_at;
  NEW.refund_eligible_until      := OLD.refund_eligible_until;
  NEW.refunded_at                := OLD.refunded_at;
  NEW.stripe_payment_intent_id   := OLD.stripe_payment_intent_id;
  NEW.stripe_checkout_session_id := OLD.stripe_checkout_session_id;
  NEW.stripe_refund_id           := OLD.stripe_refund_id;
  NEW.landlord_id                := OLD.landlord_id;
  NEW.tenant_id                  := OLD.tenant_id;
  NEW.property_id                := OLD.property_id;
  RETURN NEW;
END;$$;
REVOKE EXECUTE ON FUNCTION public.zz_guard_lease_agreements_cols() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS zz_guard_lease_agreements_cols ON public.lease_agreements;
CREATE TRIGGER zz_guard_lease_agreements_cols BEFORE UPDATE ON public.lease_agreements
FOR EACH ROW EXECUTE FUNCTION public.zz_guard_lease_agreements_cols();

-- 3. Noir rides: riders cannot touch fare/payout/status
CREATE OR REPLACE FUNCTION public.zz_guard_noir_rides_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;

  IF auth.uid() = OLD.rider_user_id THEN
    NEW.estimated_fare    := OLD.estimated_fare;
    NEW.actual_fare       := OLD.actual_fare;
    NEW.platform_fee      := OLD.platform_fee;
    NEW.driver_payout     := OLD.driver_payout;
    NEW.driver_id         := OLD.driver_id;
    NEW.payment_intent_id := OLD.payment_intent_id;
    NEW.refund_amount     := OLD.refund_amount;
    NEW.refund_status     := OLD.refund_status;
    NEW.refund_id         := OLD.refund_id;
    NEW.refunded_at       := OLD.refunded_at;
    NEW.rider_user_id     := OLD.rider_user_id;
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Riders may only cancel their own ride' USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;$$;
REVOKE EXECUTE ON FUNCTION public.zz_guard_noir_rides_cols() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS zz_guard_noir_rides_cols ON public.noir_rides;
CREATE TRIGGER zz_guard_noir_rides_cols BEFORE UPDATE ON public.noir_rides
FOR EACH ROW EXECUTE FUNCTION public.zz_guard_noir_rides_cols();

-- 4. Vacation bookings: guests cannot touch money or confirm themselves
CREATE OR REPLACE FUNCTION public.zz_guard_vacation_bookings_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;

  IF auth.uid() IS NOT NULL AND auth.uid() = OLD.guest_id THEN
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
    NEW.refund_amount     := OLD.refund_amount;
    NEW.refund_status     := OLD.refund_status;
    NEW.refund_id         := OLD.refund_id;
    NEW.refunded_at       := OLD.refunded_at;
    NEW.confirmed_at      := OLD.confirmed_at;
    NEW.admin_notes       := OLD.admin_notes;
    NEW.property_id       := OLD.property_id;
    NEW.guest_id          := OLD.guest_id;
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Guests may only cancel their own booking' USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;$$;
REVOKE EXECUTE ON FUNCTION public.zz_guard_vacation_bookings_cols() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS zz_guard_vacation_bookings_cols ON public.vacation_bookings;
CREATE TRIGGER zz_guard_vacation_bookings_cols BEFORE UPDATE ON public.vacation_bookings
FOR EACH ROW EXECUTE FUNCTION public.zz_guard_vacation_bookings_cols();
