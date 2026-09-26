CREATE OR REPLACE FUNCTION public.enforce_vacation_booking_update_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _is_host boolean;
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;

  -- Fields nobody but admin/payment system may touch
  IF (NEW.property_id, NEW.guest_id, NEW.check_in_date, NEW.check_out_date, NEW.num_nights, NEW.num_pets,
      NEW.nightly_rate, NEW.cleaning_fee, NEW.pet_fee, NEW.subtotal, NEW.platform_fee, NEW.host_payout, NEW.total_amount,
      NEW.payment_intent_id, NEW.stripe_charge_id, NEW.payout_status, NEW.payout_date,
      NEW.refund_amount, NEW.refund_status, NEW.refund_id, NEW.refunded_at, NEW.admin_notes, NEW.cancellation_policy)
     IS DISTINCT FROM
     (OLD.property_id, OLD.guest_id, OLD.check_in_date, OLD.check_out_date, OLD.num_nights, OLD.num_pets,
      OLD.nightly_rate, OLD.cleaning_fee, OLD.pet_fee, OLD.subtotal, OLD.platform_fee, OLD.host_payout, OLD.total_amount,
      OLD.payment_intent_id, OLD.stripe_charge_id, OLD.payout_status, OLD.payout_date,
      OLD.refund_amount, OLD.refund_status, OLD.refund_id, OLD.refunded_at, OLD.admin_notes, OLD.cancellation_policy) THEN
    RAISE EXCEPTION 'Only administrators may change booking pricing, dates or payment details' USING ERRCODE = '42501';
  END IF;

  SELECT EXISTS (SELECT 1 FROM vacation_properties p WHERE p.id = OLD.property_id AND p.host_id = _uid) INTO _is_host;

  IF _is_host THEN
    IF (NEW.num_guests, NEW.guest_name, NEW.guest_email, NEW.guest_phone, NEW.special_requests)
       IS DISTINCT FROM (OLD.num_guests, OLD.guest_name, OLD.guest_email, OLD.guest_phone, OLD.special_requests) THEN
      RAISE EXCEPTION 'Hosts may not edit guest details' USING ERRCODE = '42501';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status AND NOT (
         (OLD.status = 'pending' AND NEW.status IN ('confirmed','cancelled'))
      OR (OLD.status = 'confirmed' AND NEW.status IN ('completed','cancelled'))) THEN
      RAISE EXCEPTION 'Hosts may only confirm, complete or cancel bookings' USING ERRCODE = '42501';
    END IF;
    IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' AND coalesce(trim(NEW.cancellation_reason),'') = '' THEN
      RAISE EXCEPTION 'A cancellation reason is required' USING ERRCODE = '23514';
    END IF;
    RETURN NEW;
  END IF;

  IF _uid = OLD.guest_id THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      IF NEW.status <> 'cancelled' OR OLD.status NOT IN ('pending','confirmed') THEN
        RAISE EXCEPTION 'Guests may only cancel a booking' USING ERRCODE = '42501';
      END IF;
    ELSIF (NEW.num_guests, NEW.guest_name, NEW.guest_email, NEW.guest_phone, NEW.special_requests)
          IS DISTINCT FROM (OLD.num_guests, OLD.guest_name, OLD.guest_email, OLD.guest_phone, OLD.special_requests)
          AND OLD.status <> 'pending' THEN
      RAISE EXCEPTION 'Booking details can only be edited before confirmation' USING ERRCODE = '42501';
    END IF;
    IF NEW.confirmed_at IS DISTINCT FROM OLD.confirmed_at THEN
      RAISE EXCEPTION 'Guests may not confirm bookings' USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Not allowed to change this booking' USING ERRCODE = '42501';
END;$$;

DROP TRIGGER IF EXISTS trg_enforce_vacation_booking_update_cols ON public.vacation_bookings;
CREATE TRIGGER trg_enforce_vacation_booking_update_cols BEFORE UPDATE ON public.vacation_bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_vacation_booking_update_cols();

CREATE OR REPLACE FUNCTION public.enforce_vacation_property_trust_cols()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public._is_admin_or_service() THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.is_verified := false; NEW.average_rating := 0; NEW.review_count := 0;
    NEW.reviewed_at := NULL; NEW.reviewed_by := NULL; NEW.rejection_reason := NULL;
    RETURN NEW;
  END IF;
  IF (NEW.is_verified, NEW.average_rating, NEW.review_count, NEW.moderation_status, NEW.listing_status,
      NEW.reviewed_at, NEW.reviewed_by, NEW.rejection_reason, NEW.host_id)
     IS DISTINCT FROM
     (OLD.is_verified, OLD.average_rating, OLD.review_count, OLD.moderation_status, OLD.listing_status,
      OLD.reviewed_at, OLD.reviewed_by, OLD.rejection_reason, OLD.host_id) THEN
    RAISE EXCEPTION 'Only administrators may change verification, approval or rating fields' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS trg_enforce_vacation_property_trust_cols ON public.vacation_properties;
CREATE TRIGGER trg_enforce_vacation_property_trust_cols BEFORE INSERT OR UPDATE ON public.vacation_properties
FOR EACH ROW EXECUTE FUNCTION public.enforce_vacation_property_trust_cols();

DROP TRIGGER IF EXISTS trg_enforce_host_payout_methods_admin_cols ON public.host_payout_methods;
CREATE TRIGGER trg_enforce_host_payout_methods_admin_cols BEFORE UPDATE ON public.host_payout_methods
FOR EACH ROW EXECUTE FUNCTION public.enforce_host_payout_methods_admin_cols();
CREATE OR REPLACE FUNCTION public.enforce_host_payout_methods_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public._is_admin_or_service() THEN NEW.is_verified := false; END IF;
  RETURN NEW;
END;$$;
DROP TRIGGER IF EXISTS trg_enforce_host_payout_methods_insert ON public.host_payout_methods;
CREATE TRIGGER trg_enforce_host_payout_methods_insert BEFORE INSERT ON public.host_payout_methods
FOR EACH ROW EXECUTE FUNCTION public.enforce_host_payout_methods_insert();

REVOKE EXECUTE ON FUNCTION public.enforce_vacation_booking_update_cols() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_vacation_property_trust_cols() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_host_payout_methods_insert() FROM PUBLIC, anon, authenticated;