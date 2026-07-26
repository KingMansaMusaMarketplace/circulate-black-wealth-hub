CREATE OR REPLACE FUNCTION public.search_directory_businesses(
  p_search_term text DEFAULT NULL::text,
  p_category text DEFAULT NULL::text,
  p_min_rating numeric DEFAULT NULL::numeric,
  p_limit integer DEFAULT 24,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid, business_name text, name text, description text, category text,
  address text, city text, state text, zip_code text, website text,
  logo_url text, banner_url text, is_verified boolean, average_rating numeric,
  review_count integer, latitude double precision, longitude double precision,
  created_at timestamp with time zone, updated_at timestamp with time zone,
  listing_status text, is_founding_member boolean, is_founding_sponsor boolean,
  total_count bigint
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
SET statement_timeout TO '20s'
AS $function$
DECLARE
  v_term text;
  v_pattern text;
  v_total bigint;
BEGIN
  v_term := nullif(trim(coalesce(p_search_term, '')), '');
  v_pattern := CASE WHEN v_term IS NULL THEN NULL ELSE '%'||v_term||'%' END;

  -- Fast count that reuses the same predicates
  SELECT count(*) INTO v_total
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
    AND (
      v_pattern IS NULL
      OR b.business_name ILIKE v_pattern
      OR b.name          ILIKE v_pattern
      OR b.city          ILIKE v_pattern
      OR b.state         ILIKE v_pattern
      OR b.category      ILIKE v_pattern
      OR b.zip_code      ILIKE v_pattern
    );

  RETURN QUERY
  SELECT b.id,
         b.business_name::text, b.name::text, b.description::text, b.category::text,
         b.address::text, b.city::text, b.state::text, b.zip_code::text, b.website::text,
         b.logo_url::text, b.banner_url::text, b.is_verified, b.average_rating,
         b.review_count::int, b.latitude::double precision, b.longitude::double precision,
         b.created_at, b.updated_at, b.listing_status::text,
         b.is_founding_member, b.is_founding_sponsor,
         v_total AS total_count
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
    AND (
      v_pattern IS NULL
      OR b.business_name ILIKE v_pattern
      OR b.name          ILIKE v_pattern
      OR b.city          ILIKE v_pattern
      OR b.state         ILIKE v_pattern
      OR b.category      ILIKE v_pattern
      OR b.zip_code      ILIKE v_pattern
    )
  ORDER BY b.is_verified DESC,
           b.average_rating DESC NULLS LAST,
           b.created_at DESC
  LIMIT  GREATEST(COALESCE(p_limit, 24), 1)
  OFFSET GREATEST(COALESCE(p_offset, 0), 0);
END;
$function$;

REVOKE ALL ON FUNCTION public.search_directory_businesses(text, text, numeric, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_directory_businesses(text, text, numeric, integer, integer) TO anon, authenticated, service_role;