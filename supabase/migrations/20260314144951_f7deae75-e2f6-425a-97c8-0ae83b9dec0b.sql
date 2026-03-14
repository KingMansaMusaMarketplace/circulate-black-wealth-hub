-- Fix return type alignment for get_directory_businesses RPC
CREATE OR REPLACE FUNCTION public.get_directory_businesses(
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
    b.description::text,
    b.category::text,
    b.address::text,
    b.city::text,
    b.state::text,
    b.zip_code::text,
    b.website::text,
    b.logo_url::text,
    b.banner_url::text,
    b.is_verified,
    b.average_rating,
    b.review_count,
    b.location_type::text,
    b.location_name::text,
    b.latitude,
    b.longitude,
    b.listing_status::text,
    b.created_at,
    b.updated_at
  FROM public.businesses b
  WHERE b.is_verified = true OR b.listing_status = 'live'
  ORDER BY b.is_verified DESC, b.created_at DESC
  LIMIT COALESCE(p_limit, 20)
  OFFSET COALESCE(p_offset, 0);
END;
$$;