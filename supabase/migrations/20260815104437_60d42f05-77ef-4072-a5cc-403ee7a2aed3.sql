
-- Scheduled rides: riders may not change fare, status (other than cancel), or assignment fields
CREATE OR REPLACE FUNCTION public.enforce_noire_scheduled_rides_rider_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;

  IF auth.uid() = OLD.rider_user_id THEN
    NEW.estimated_fare        := OLD.estimated_fare;
    NEW.preferred_driver_id   := OLD.preferred_driver_id;
    NEW.hotel_partner_id      := OLD.hotel_partner_id;
    NEW.booked_by_concierge_id := OLD.booked_by_concierge_id;
    NEW.rider_user_id         := OLD.rider_user_id;

    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Riders may only cancel a scheduled ride' USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_noire_scheduled_rides_rider_cols ON public.noire_scheduled_rides;
CREATE TRIGGER trg_noire_scheduled_rides_rider_cols
BEFORE UPDATE ON public.noire_scheduled_rides
FOR EACH ROW EXECUTE FUNCTION public.enforce_noire_scheduled_rides_rider_cols();

-- Lease agreements: tenants may only confirm / cancel, never touch rent or dates
CREATE OR REPLACE FUNCTION public.enforce_lease_agreements_tenant_cols()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;

  IF auth.uid() = OLD.tenant_id THEN
    NEW.monthly_rent          := OLD.monthly_rent;
    NEW.fee_amount            := OLD.fee_amount;
    NEW.fee_currency          := OLD.fee_currency;
    NEW.fee_charged_at        := OLD.fee_charged_at;
    NEW.refund_eligible_until := OLD.refund_eligible_until;
    NEW.refunded_at           := OLD.refunded_at;
    NEW.stripe_payment_intent_id  := OLD.stripe_payment_intent_id;
    NEW.stripe_checkout_session_id := OLD.stripe_checkout_session_id;
    NEW.stripe_refund_id      := OLD.stripe_refund_id;
    NEW.lease_start_date      := OLD.lease_start_date;
    NEW.lease_end_date        := OLD.lease_end_date;
    NEW.landlord_id           := OLD.landlord_id;
    NEW.tenant_id             := OLD.tenant_id;
    NEW.property_id           := OLD.property_id;
    NEW.landlord_confirmed_at := OLD.landlord_confirmed_at;

    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Tenants may only cancel a lease agreement' USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_lease_agreements_tenant_cols ON public.lease_agreements;
CREATE TRIGGER trg_lease_agreements_tenant_cols
BEFORE UPDATE ON public.lease_agreements
FOR EACH ROW EXECUTE FUNCTION public.enforce_lease_agreements_tenant_cols();
