CREATE OR REPLACE FUNCTION public.zzzz_lock_noir_ride_money_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF auth.uid() IS NOT NULL AND auth.uid() = OLD.rider_user_id THEN
    IF NOT (NEW.status = 'cancelled' AND OLD.status IS DISTINCT FROM 'completed') THEN
      NEW.status := OLD.status;
    END IF;
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
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.zzzz_lock_noir_ride_money_cols() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS zzzz_lock_noir_ride_money_cols ON public.noir_rides;
CREATE TRIGGER zzzz_lock_noir_ride_money_cols
BEFORE UPDATE ON public.noir_rides
FOR EACH ROW EXECUTE FUNCTION public.zzzz_lock_noir_ride_money_cols();