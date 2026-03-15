
CREATE OR REPLACE FUNCTION public.get_directory_business_by_id(
  p_business_id uuid
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
  phone text,
  email text,
  website text,
  logo_url text,
  banner_url text,
  is_verified boolean,
  is_founding_sponsor boolean,
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
    b.phone::text,
    b.email::text,
    b.website::text,
    b.logo_url::text,
    b.banner_url::text,
    b.is_verified,
    b.is_founding_sponsor,
    b.average_rating,
    b.review_count,
    b.location_type::text,
    b.location_name::text,
    b.latitude::double precision,
    b.longitude::double precision,
    b.listing_status::text,
    b.created_at,
    b.updated_at
  FROM public.businesses b
  WHERE b.id = p_business_id
    AND (b.is_verified = true OR b.listing_status = 'live');
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_directory_business_by_id(uuid) TO anon, authenticated, service_role;
COMMENT ON FUNCTION public.get_directory_business_by_id IS 'Secure function to fetch a single business by ID for the public detail page, bypassing RLS with SECURITY DEFINER';
