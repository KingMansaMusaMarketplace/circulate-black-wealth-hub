CREATE OR REPLACE FUNCTION public.get_directory_map_markers(
  p_search_term text DEFAULT NULL::text,
  p_category text DEFAULT NULL::text,
  p_min_rating numeric DEFAULT NULL::numeric,
  p_category_group text DEFAULT NULL::text,
  p_country text DEFAULT NULL::text,
  p_state text DEFAULT NULL::text,
  p_city text DEFAULT NULL::text
)
 RETURNS TABLE(id uuid, business_name text, latitude double precision, longitude double precision, category text, average_rating numeric)
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
    AND (p_category_group IS NULL OR b.category_group = p_category_group)
    AND (p_country IS NULL OR b.country = p_country)
    AND (p_state IS NULL OR b.state = p_state)
    AND (p_city IS NULL OR b.city = p_city)
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

GRANT EXECUTE ON FUNCTION public.get_directory_map_markers(text, text, numeric, text, text, text, text) TO anon, authenticated, service_role;