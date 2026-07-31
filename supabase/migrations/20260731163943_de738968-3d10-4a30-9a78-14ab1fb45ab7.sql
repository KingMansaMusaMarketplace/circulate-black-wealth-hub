-- 1) Fix broken host payout method guard (referenced non-existent columns)
DROP TRIGGER IF EXISTS trg_guard_host_payout_methods ON public.host_payout_methods;
DROP FUNCTION IF EXISTS public.guard_host_payout_methods();

CREATE OR REPLACE FUNCTION public.enforce_host_payout_methods_admin_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    RAISE EXCEPTION 'Only administrators may verify a payout method'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS trg_host_payout_methods_admin_cols ON public.host_payout_methods;
CREATE TRIGGER trg_host_payout_methods_admin_cols
BEFORE UPDATE ON public.host_payout_methods
FOR EACH ROW EXECUTE FUNCTION public.enforce_host_payout_methods_admin_cols();

-- 2) Lock rider tampering on noir_rides
CREATE OR REPLACE FUNCTION public.enforce_noir_rides_rider_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_is_driver boolean := false;
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.noir_drivers d
    WHERE d.id = OLD.driver_id AND d.user_id = auth.uid()
  ) INTO v_is_driver;

  IF v_is_driver THEN
    -- Drivers may progress the ride but never touch money fields
    NEW.estimated_fare  := OLD.estimated_fare;
    NEW.actual_fare     := OLD.actual_fare;
    NEW.platform_fee    := OLD.platform_fee;
    NEW.driver_payout   := OLD.driver_payout;
    NEW.payment_intent_id := OLD.payment_intent_id;
    NEW.refund_amount   := OLD.refund_amount;
    NEW.refund_status   := OLD.refund_status;
    NEW.refund_id       := OLD.refund_id;
    NEW.refunded_at     := OLD.refunded_at;
    NEW.rider_rating    := OLD.rider_rating;
    RETURN NEW;
  END IF;

  IF auth.uid() = OLD.rider_user_id THEN
    -- Riders may only cancel, add a cancellation reason, or rate the driver
    NEW.estimated_fare  := OLD.estimated_fare;
    NEW.actual_fare     := OLD.actual_fare;
    NEW.platform_fee    := OLD.platform_fee;
    NEW.driver_payout   := OLD.driver_payout;
    NEW.driver_id       := OLD.driver_id;
    NEW.payment_intent_id := OLD.payment_intent_id;
    NEW.refund_amount   := OLD.refund_amount;
    NEW.refund_status   := OLD.refund_status;
    NEW.refund_id       := OLD.refund_id;
    NEW.refunded_at     := OLD.refunded_at;
    NEW.refund_reason   := OLD.refund_reason;
    NEW.driver_rating   := OLD.driver_rating;
    NEW.accepted_at     := OLD.accepted_at;
    NEW.pickup_at       := OLD.pickup_at;
    NEW.dropoff_at      := OLD.dropoff_at;

    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Riders may only cancel their own ride'
        USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Not authorized to modify this ride' USING ERRCODE = '42501';
END;$$;

DROP TRIGGER IF EXISTS trg_noir_rides_rider_cols ON public.noir_rides;
CREATE TRIGGER trg_noir_rides_rider_cols
BEFORE UPDATE ON public.noir_rides
FOR EACH ROW EXECUTE FUNCTION public.enforce_noir_rides_rider_cols();

-- 3) Restrict guest status transitions on vacation_bookings
CREATE OR REPLACE FUNCTION public.enforce_vacation_bookings_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;

  IF auth.uid() = OLD.guest_id
     AND NEW.status IS DISTINCT FROM OLD.status
     AND NEW.status::text <> 'cancelled' THEN
    RAISE EXCEPTION 'Guests may only cancel a booking'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS trg_vacation_bookings_status ON public.vacation_bookings;
CREATE TRIGGER trg_vacation_bookings_status
BEFORE UPDATE ON public.vacation_bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_vacation_bookings_status();