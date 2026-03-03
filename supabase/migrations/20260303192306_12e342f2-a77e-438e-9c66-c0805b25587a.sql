
-- Fix: Recreate vacation properties function with correct column types
CREATE OR REPLACE FUNCTION public.get_public_vacation_properties(
  p_city text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_limit int DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  property_type text,
  city text,
  state text,
  country text,
  latitude double precision,
  longitude double precision,
  bedrooms integer,
  bathrooms integer,
  max_guests integer,
  base_nightly_rate numeric,
  cleaning_fee numeric,
  amenities jsonb,
  photos jsonb,
  is_instant_book boolean,
  is_verified boolean,
  min_nights integer,
  max_nights integer,
  check_in_time text,
  check_out_time text,
  pets_allowed boolean,
  pet_fee numeric,
  average_rating numeric,
  review_count integer,
  cancellation_policy text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    vp.id, vp.title, vp.description, vp.property_type,
    vp.city, vp.state, vp.country, vp.latitude, vp.longitude,
    vp.bedrooms, vp.bathrooms, vp.max_guests,
    vp.base_nightly_rate, vp.cleaning_fee,
    vp.amenities, vp.photos,
    vp.is_instant_book, vp.is_verified,
    vp.min_nights, vp.max_nights,
    vp.check_in_time, vp.check_out_time,
    vp.pets_allowed, vp.pet_fee,
    vp.average_rating, vp.review_count,
    vp.cancellation_policy
  FROM public.vacation_properties vp
  WHERE vp.is_active = true
    AND (p_city IS NULL OR vp.city ILIKE p_city)
    AND (p_state IS NULL OR vp.state = p_state)
  ORDER BY vp.created_at DESC
  LIMIT p_limit;
$$;
