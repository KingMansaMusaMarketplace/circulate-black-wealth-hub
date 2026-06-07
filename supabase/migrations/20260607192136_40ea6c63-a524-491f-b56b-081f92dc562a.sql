CREATE OR REPLACE FUNCTION public.search_directory_businesses(p_search_term text DEFAULT NULL::text, p_category text DEFAULT NULL::text, p_min_rating numeric DEFAULT NULL::numeric, p_limit integer DEFAULT 24, p_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, business_name text, name text, description text, category text, address text, city text, state text, zip_code text, website text, logo_url text, banner_url text, is_verified boolean, average_rating numeric, review_count integer, latitude double precision, longitude double precision, created_at timestamp with time zone, updated_at timestamp with time zone, listing_status text, is_founding_member boolean, is_founding_sponsor boolean, total_count bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_term   text;
  v_tokens text[];
BEGIN
  v_term := nullif(trim(coalesce(p_search_term, '')), '');
  IF v_term IS NOT NULL THEN
    v_tokens := regexp_split_to_array(v_term, '\s+');
  END IF;

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
      v_tokens IS NULL
      OR NOT EXISTS (
        SELECT 1 FROM unnest(v_tokens) AS tok
        WHERE tok <> ''
          AND COALESCE(b.business_name,'') NOT ILIKE '%'||tok||'%'
          AND COALESCE(b.name,'')          NOT ILIKE '%'||tok||'%'
          AND COALESCE(b.city,'')          NOT ILIKE '%'||tok||'%'
          AND COALESCE(b.state,'')         NOT ILIKE '%'||tok||'%'
          AND COALESCE(b.category,'')      NOT ILIKE '%'||tok||'%'
          AND COALESCE(b.description,'')   NOT ILIKE '%'||tok||'%'
          AND COALESCE(b.address,'')       NOT ILIKE '%'||tok||'%'
          AND COALESCE(b.zip_code,'')      NOT ILIKE '%'||tok||'%'
      )
    )
  ORDER BY b.is_verified DESC,
           b.average_rating DESC NULLS LAST,
           b.created_at DESC
  LIMIT  GREATEST(COALESCE(p_limit, 24), 1)
  OFFSET GREATEST(COALESCE(p_offset, 0), 0);
END;
$function$;