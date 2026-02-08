-- Fix search_path for security definer functions

-- Fix update_vacation_updated_at function
CREATE OR REPLACE FUNCTION public.update_vacation_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Fix update_property_rating function
CREATE OR REPLACE FUNCTION public.update_property_rating()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.vacation_properties
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.property_reviews
            WHERE property_id = NEW.property_id AND is_public = true
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.property_reviews
            WHERE property_id = NEW.property_id AND is_public = true
        )
    WHERE id = NEW.property_id;
    RETURN NEW;
END;
$$;

-- Fix block_availability_on_booking function
CREATE OR REPLACE FUNCTION public.block_availability_on_booking()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    d DATE;
BEGIN
    IF NEW.status = 'confirmed' AND (OLD IS NULL OR OLD.status != 'confirmed') THEN
        FOR d IN SELECT generate_series(NEW.check_in_date, NEW.check_out_date - INTERVAL '1 day', '1 day')::date
        LOOP
            INSERT INTO public.property_availability (property_id, date, is_available, booking_id)
            VALUES (NEW.property_id, d, false, NEW.id)
            ON CONFLICT (property_id, date) 
            DO UPDATE SET is_available = false, booking_id = NEW.id;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$;