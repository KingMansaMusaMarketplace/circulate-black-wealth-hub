-- Recreate directory RPC with expanded safe fields for public directory rendering
DROP FUNCTION IF EXISTS public.get_directory_businesses(integer, integer);

CREATE FUNCTION public.get_directory_businesses(
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  business_name text,
  name text,
  description text,
  category text,
  address text,
  city text,
  state text,
  zip_code text,
  website text,
  logo_url text,
  banner_url text,
  is_verified boolean,
  average_rating numeric,
  review_count integer,
  location_type text,
  location_name text,
  latitude double precision,
  longitude double precision,
  listing_status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.business_name::text,
    b.name::text,
    b.description,
    b.category::text,
    b.address,
    b.city::text,
    b.state::text,
    b.zip_code,
    b.website,
    b.logo_url,
    b.banner_url,
    b.is_verified,
    b.average_rating,
    b.review_count,
    b.location_type,
    b.location_name,
    b.latitude,
    b.longitude,
    b.listing_status,
    b.created_at,
    b.updated_at
  FROM public.businesses b
  WHERE b.is_verified = true OR b.listing_status = 'live'
  ORDER BY b.is_verified DESC, b.created_at DESC
  LIMIT COALESCE(p_limit, 20)
  OFFSET COALESCE(p_offset, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_directory_businesses(integer, integer) TO anon, authenticated, service_role;