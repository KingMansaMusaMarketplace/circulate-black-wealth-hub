
-- 1. Sponsors: block self-upgrade of tier/status/dates
CREATE OR REPLACE FUNCTION public.protect_sponsors_privileged_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_secure() OR (auth.jwt() ->> 'role') = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.sponsorship_tier IS DISTINCT FROM OLD.sponsorship_tier
     OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.subscription_start_date IS DISTINCT FROM OLD.subscription_start_date
     OR NEW.subscription_end_date IS DISTINCT FROM OLD.subscription_end_date THEN
    RAISE EXCEPTION 'Only admins can modify sponsorship tier, status, or subscription dates';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_sponsors_privileged_fields_trigger ON public.sponsors;
CREATE TRIGGER protect_sponsors_privileged_fields_trigger
  BEFORE UPDATE ON public.sponsors
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_sponsors_privileged_fields();

-- 2. Vacation bookings: block guest tampering of financial fields
CREATE OR REPLACE FUNCTION public.protect_vacation_bookings_financial_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin_secure() OR (auth.jwt() ->> 'role') = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.total_amount IS DISTINCT FROM OLD.total_amount
     OR NEW.subtotal IS DISTINCT FROM OLD.subtotal
     OR NEW.host_payout IS DISTINCT FROM OLD.host_payout
     OR NEW.platform_fee IS DISTINCT FROM OLD.platform_fee
     OR NEW.currency IS DISTINCT FROM OLD.currency THEN
    RAISE EXCEPTION 'Only admins can modify booking financial amounts';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_vacation_bookings_financial_fields_trigger ON public.vacation_bookings;
CREATE TRIGGER protect_vacation_bookings_financial_fields_trigger
  BEFORE UPDATE ON public.vacation_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_vacation_bookings_financial_fields();
