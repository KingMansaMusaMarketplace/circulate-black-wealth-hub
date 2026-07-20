CREATE OR REPLACE FUNCTION public.protect_noir_drivers_privileged()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin_or_service() THEN RETURN NEW; END IF;

  -- Allow the driver (owner) to submit their own draft application
  IF NEW.application_status IS DISTINCT FROM OLD.application_status THEN
    IF auth.uid() = OLD.user_id
       AND OLD.application_status = 'draft'
       AND NEW.application_status = 'submitted' THEN
      -- allowed transition
      NULL;
    ELSE
      RAISE EXCEPTION 'Not authorized to modify driver approval/earnings/rating fields';
    END IF;
  END IF;

  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.total_earnings IS DISTINCT FROM OLD.total_earnings
     OR NEW.rating_average IS DISTINCT FROM OLD.rating_average
  THEN
    RAISE EXCEPTION 'Not authorized to modify driver approval/earnings/rating fields';
  END IF;

  RETURN NEW;
END;$$;