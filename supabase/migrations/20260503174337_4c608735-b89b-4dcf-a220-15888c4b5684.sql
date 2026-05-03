CREATE OR REPLACE FUNCTION public.search_directory_businesses(
  p_search_term text DEFAULT NULL::text,
  p_category text DEFAULT NULL::text,
  p_min_rating numeric DEFAULT NULL::numeric,
  p_limit integer DEFAULT 24,
  p_offset integer DEFAULT 0
)
 RETURNS TABLE(id uuid, business_name text, name text, description text, category text, address text, city text, state text, zip_code text, website text, logo_url text, banner_url text, is_verified boolean, average_rating numeric, review_count integer, latitude double precision, longitude double precision, created_at timestamp with time zone, updated_at timestamp with time zone, listing_status text, is_founding_member boolean, is_founding_sponsor boolean, total_count bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_tokens text[];
  v_clean text;
BEGIN
  v_clean := lower(coalesce(trim(p_search_term), ''));

  IF v_clean = '' THEN
    v_tokens := ARRAY[]::text[];
  ELSE
    SELECT array_agg(tok) INTO v_tokens
    FROM (
      SELECT unnest(regexp_split_to_array(v_clean, '[^a-z0-9]+')) AS tok
    ) t
    WHERE tok IS NOT NULL
      AND length(tok) > 1
      AND tok NOT IN ('in','near','around','at','the','a','an','of','for','and','to','my','me','find','show','list','best','top','some','any','open','located');

    IF v_tokens IS NULL THEN v_tokens := ARRAY[]::text[]; END IF;
  END IF;

  RETURN QUERY
  SELECT b.id,
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
         b.review_count::INT,
         b.latitude::DOUBLE PRECISION,
         b.longitude::DOUBLE PRECISION,
         b.created_at,
         b.updated_at,
         b.listing_status::text,
         b.is_founding_member,
         b.is_founding_sponsor,
         COUNT(*) OVER() AS total_count
  FROM businesses b
  WHERE b.listing_status = 'live'
    AND (
      coalesce(array_length(v_tokens, 1), 0) = 0
      OR NOT EXISTS (
        SELECT 1 FROM unnest(v_tokens) AS tok
        WHERE NOT (
          b.business_name ILIKE '%' || tok || '%' OR
          b.name         ILIKE '%' || tok || '%' OR
          b.category     ILIKE '%' || tok || '%' OR
          b.description  ILIKE '%' || tok || '%' OR
          b.city         ILIKE '%' || tok || '%' OR
          b.state        ILIKE '%' || tok || '%' OR
          b.address      ILIKE '%' || tok || '%'
        )
      )
    )
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
  ORDER BY b.is_verified DESC, b.average_rating DESC NULLS LAST, b.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$function$;