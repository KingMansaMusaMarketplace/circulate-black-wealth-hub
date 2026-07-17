
CREATE OR REPLACE FUNCTION public.search_public_businesses(
    p_search_term text DEFAULT NULL::text,
    p_category text DEFAULT NULL::text,
    p_min_rating numeric DEFAULT NULL::numeric,
    p_featured boolean DEFAULT NULL::boolean,
    p_limit integer DEFAULT 20,
    p_offset integer DEFAULT 0
)
RETURNS TABLE(
    id uuid, business_name character varying, description text, category character varying,
    city character varying, state character varying, logo_url character varying, banner_url character varying,
    is_verified boolean, average_rating numeric, review_count integer,
    created_at timestamp with time zone, total_count bigint
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_term text := NULLIF(trim(COALESCE(p_search_term, '')), '');
BEGIN
    RETURN QUERY
    WITH filtered AS (
        SELECT b.id, b.business_name, b.description, b.category, b.city, b.state,
               b.logo_url, b.banner_url, b.is_verified, b.average_rating, b.review_count, b.created_at
        FROM public.businesses b
        WHERE b.listing_status = 'live'
          AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
          AND (p_min_rating IS NULL OR p_min_rating <= 0 OR b.average_rating >= p_min_rating)
          AND (p_featured IS NOT TRUE OR b.is_verified = true)
          AND (
            v_term IS NULL
            OR b.business_name ILIKE '%' || v_term || '%'
            OR b.category      ILIKE '%' || v_term || '%'
          )
    ),
    counted AS (
        SELECT f.*, COUNT(*) OVER () AS total_count
        FROM filtered f
    )
    SELECT c.id, c.business_name, c.description, c.category, c.city, c.state,
           c.logo_url, c.banner_url, c.is_verified, c.average_rating, c.review_count,
           c.created_at, c.total_count
    FROM counted c
    ORDER BY c.is_verified DESC, c.average_rating DESC NULLS LAST, c.created_at DESC
    LIMIT COALESCE(p_limit, 20)
    OFFSET COALESCE(p_offset, 0);
END;
$function$;
