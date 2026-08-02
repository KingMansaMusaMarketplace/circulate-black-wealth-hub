CREATE OR REPLACE FUNCTION public.protect_noir_drivers_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.is_active IS DISTINCT FROM OLD.is_active
     OR NEW.rating_average IS DISTINCT FROM OLD.rating_average
     OR NEW.total_rides IS DISTINCT FROM OLD.total_rides
     OR NEW.total_earnings IS DISTINCT FROM OLD.total_earnings THEN
    RAISE EXCEPTION 'Not authorized to modify driver approval/earnings fields';
  END IF;
  IF NEW.application_status IS DISTINCT FROM OLD.application_status THEN
    IF NOT (OLD.application_status = 'draft' AND NEW.application_status = 'submitted') THEN
      RAISE EXCEPTION 'Not authorized to change application_status';
    END IF;
  END IF;
  RETURN NEW;
END;$function$;

CREATE OR REPLACE FUNCTION public.protect_vacation_properties_v2()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF public._sec_is_admin_or_system() THEN RETURN NEW; END IF;
  IF NEW.is_verified IS DISTINCT FROM OLD.is_verified
     OR NEW.moderation_status IS DISTINCT FROM OLD.moderation_status
     OR NEW.average_rating IS DISTINCT FROM OLD.average_rating
     OR NEW.review_count IS DISTINCT FROM OLD.review_count THEN
    RAISE EXCEPTION 'Not authorized to modify verification/rating fields';
  END IF;
  IF NEW.listing_status IS DISTINCT FROM OLD.listing_status THEN
    IF NOT (OLD.listing_status IN ('draft','rejected') AND NEW.listing_status = 'pending_review') THEN
      RAISE EXCEPTION 'Not authorized to change listing_status';
    END IF;
  END IF;
  RETURN NEW;
END;$function$;