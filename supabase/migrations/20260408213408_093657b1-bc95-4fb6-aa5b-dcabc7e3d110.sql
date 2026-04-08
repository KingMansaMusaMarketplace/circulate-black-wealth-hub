
-- Fix Timeless Tunez listing status
UPDATE businesses 
SET listing_status = 'live' 
WHERE id = '263d6623-2077-4cfb-8758-a6e21e6c4af9';

-- Drop and recreate with listing_status filter
DROP FUNCTION IF EXISTS public.search_public_businesses(text, text, numeric, boolean, integer, integer);

CREATE OR REPLACE FUNCTION public.search_public_businesses(
    p_search_term text DEFAULT NULL,
    p_category text DEFAULT NULL,
    p_min_rating numeric DEFAULT NULL,
    p_featured boolean DEFAULT NULL,
    p_limit integer DEFAULT 20,
    p_offset integer DEFAULT 0
)
RETURNS TABLE(
    id uuid,
    business_name character varying,
    description text,
    category character varying,
    city character varying,
    state character varying,
    logo_url character varying,
    banner_url character varying,
    is_verified boolean,
    average_rating numeric,
    review_count integer,
    created_at timestamptz,
    total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_query text;
    v_conditions text[] := ARRAY['(is_verified = true OR listing_status = ''live'')']::text[];
    v_count bigint;
BEGIN
    IF p_search_term IS NOT NULL AND trim(p_search_term) != '' THEN
        v_conditions := array_append(v_conditions, 
            format('(business_name ILIKE %L OR category ILIKE %L)', 
                   '%' || trim(p_search_term) || '%',
                   '%' || trim(p_search_term) || '%'));
    END IF;
    
    IF p_category IS NOT NULL AND p_category != 'all' THEN
        v_conditions := array_append(v_conditions, format('category = %L', p_category));
    END IF;
    
    IF p_min_rating IS NOT NULL AND p_min_rating > 0 THEN
        v_conditions := array_append(v_conditions, format('average_rating >= %s', p_min_rating));
    END IF;
    
    IF p_featured IS TRUE THEN
        v_conditions := array_append(v_conditions, 'is_verified = true');
    END IF;
    
    v_query := 'SELECT COUNT(*) FROM businesses WHERE ' || array_to_string(v_conditions, ' AND ');
    EXECUTE v_query INTO v_count;
    
    RETURN QUERY EXECUTE format('
        SELECT 
            b.id,
            b.business_name,
            b.description,
            b.category,
            b.city,
            b.state,
            b.logo_url,
            b.banner_url,
            b.is_verified,
            b.average_rating,
            b.review_count,
            b.created_at,
            %s::bigint as total_count
        FROM businesses b
        WHERE %s
        ORDER BY b.is_verified DESC, b.created_at DESC
        LIMIT %s OFFSET %s',
        v_count,
        array_to_string(v_conditions, ' AND '),
        COALESCE(p_limit, 20),
        COALESCE(p_offset, 0)
    );
END;
$$;
