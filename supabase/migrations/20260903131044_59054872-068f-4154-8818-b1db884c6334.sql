CREATE OR REPLACE FUNCTION public.supplier_search_api(
  p_query text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_zip text DEFAULT NULL,
  p_radius_miles double precision DEFAULT 25,
  p_verified_only boolean DEFAULT false,
  p_limit integer DEFAULT 25,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  business_name character varying,
  description text,
  category character varying,
  city character varying,
  state character varying,
  zip_code character varying,
  phone character varying,
  website character varying,
  slug character varying,
  is_verified boolean,
  ownership_verified boolean,
  average_rating numeric,
  review_count integer,
  distance_miles double precision,
  total_count bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_term text := NULLIF(trim(COALESCE(p_query, '')), '');
  v_zip text := NULLIF(trim(COALESCE(p_zip, '')), '');
  v_lat double precision;
  v_lng double precision;
  v_radius double precision := LEAST(GREATEST(COALESCE(p_radius_miles, 25), 1), 250);
BEGIN
  IF v_zip IS NOT NULL THEN
    SELECT avg(b.latitude), avg(b.longitude)
      INTO v_lat, v_lng
    FROM public.businesses b
    WHERE b.zip_code = v_zip
      AND b.latitude IS NOT NULL
      AND b.longitude IS NOT NULL;
  END IF;

  RETURN QUERY
  WITH base AS (
    SELECT b.*,
      CASE
        WHEN v_lat IS NULL OR b.latitude IS NULL OR b.longitude IS NULL THEN NULL::double precision
        ELSE 3958.8 * 2 * asin(sqrt(
          power(sin(radians(b.latitude - v_lat) / 2), 2) +
          cos(radians(v_lat)) * cos(radians(b.latitude)) *
          power(sin(radians(b.longitude - v_lng) / 2), 2)
        ))
      END AS dist
    FROM public.businesses b
    WHERE b.listing_status = 'live'
      AND (p_category IS NULL OR b.category ILIKE p_category)
      AND (p_city IS NULL OR b.city ILIKE p_city)
      AND (p_state IS NULL OR b.state ILIKE p_state)
      AND (p_verified_only IS NOT TRUE OR b.is_verified = true)
      AND (
        v_term IS NULL
        OR b.business_name ILIKE '%' || v_term || '%'
        OR b.category ILIKE '%' || v_term || '%'
        OR b.description ILIKE '%' || v_term || '%'
      )
  ),
  filtered AS (
    SELECT * FROM base
    WHERE v_lat IS NULL OR (dist IS NOT NULL AND dist <= v_radius)
  ),
  counted AS (
    SELECT count(*) AS c FROM filtered
  )
  SELECT f.id, f.business_name, f.description, f.category, f.city, f.state,
         f.zip_code, f.phone, f.website, f.slug,
         COALESCE(f.is_verified, false),
         (COALESCE(f.black_owned_confidence, 0) >= 0.7 AND f.ownership_flagged IS NOT TRUE),
         f.average_rating, f.review_count, f.dist,
         (SELECT c FROM counted)
  FROM filtered f
  ORDER BY
    CASE WHEN v_lat IS NULL THEN NULL ELSE f.dist END ASC NULLS LAST,
    f.is_verified DESC NULLS LAST,
    f.average_rating DESC NULLS LAST,
    f.business_name ASC
  LIMIT LEAST(COALESCE(p_limit, 25), 100)
  OFFSET GREATEST(COALESCE(p_offset, 0), 0);
END;
$function$;

REVOKE ALL ON FUNCTION public.supplier_search_api(text,text,text,text,text,double precision,boolean,integer,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.supplier_search_api(text,text,text,text,text,double precision,boolean,integer,integer) TO service_role;