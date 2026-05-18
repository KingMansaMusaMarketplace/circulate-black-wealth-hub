
-- Faster directory search: use trigram indexes via simple ILIKE on indexed columns
CREATE OR REPLACE FUNCTION public.search_directory_businesses(
  p_search_term text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_min_rating numeric DEFAULT NULL,
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
AS $function$
DECLARE
  v_term text;
  v_pat  text;
BEGIN
  v_term := nullif(trim(coalesce(p_search_term, '')), '');
  v_pat  := CASE WHEN v_term IS NULL THEN NULL ELSE '%' || v_term || '%' END;

  RETURN QUERY
  SELECT b.id,
         b.business_name::text, b.name::text, b.description::text, b.category::text,
         b.address::text, b.city::text, b.state::text, b.zip_code::text, b.website::text,
         b.logo_url::text, b.banner_url::text, b.is_verified, b.average_rating,
         b.review_count::int, b.latitude::double precision, b.longitude::double precision,
         b.created_at, b.updated_at, b.listing_status::text,
         b.is_founding_member, b.is_founding_sponsor,
         COUNT(*) OVER() AS total_count
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
    AND (
      v_pat IS NULL
      OR b.business_name ILIKE v_pat
      OR b.name          ILIKE v_pat
      OR b.city          ILIKE v_pat
      OR b.state         ILIKE v_pat
      OR b.category      ILIKE v_pat
    )
  ORDER BY b.is_verified DESC,
           b.average_rating DESC NULLS LAST,
           b.created_at DESC
  LIMIT  GREATEST(COALESCE(p_limit, 24), 1)
  OFFSET GREATEST(COALESCE(p_offset, 0), 0);
END;
$function$;

-- Capped map markers so we never return 39k+ rows
CREATE OR REPLACE FUNCTION public.get_directory_map_markers(
  p_search_term text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_min_rating numeric DEFAULT NULL
)
RETURNS TABLE(
  id uuid, business_name text, latitude double precision, longitude double precision,
  category text, average_rating numeric
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH params AS (
    SELECT CASE
             WHEN nullif(trim(coalesce(p_search_term,'')), '') IS NULL THEN NULL
             ELSE '%' || trim(p_search_term) || '%'
           END AS pat
  )
  SELECT b.id, b.business_name, b.latitude, b.longitude, b.category, b.average_rating
  FROM public.businesses b, params
  WHERE b.listing_status = 'live'
    AND b.latitude IS NOT NULL
    AND b.longitude IS NOT NULL
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
    AND (
      params.pat IS NULL
      OR b.business_name ILIKE params.pat
      OR b.city          ILIKE params.pat
      OR b.category      ILIKE params.pat
    )
  ORDER BY b.is_verified DESC,
           b.average_rating DESC NULLS LAST,
           b.created_at DESC
  LIMIT 2000;
$function$;
