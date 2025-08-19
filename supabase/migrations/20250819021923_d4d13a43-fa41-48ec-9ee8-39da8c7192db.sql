-- Create a secure function for business search with filters that excludes sensitive contact info
CREATE OR REPLACE FUNCTION public.search_public_businesses(
    p_search_term text DEFAULT NULL,
    p_category text DEFAULT NULL,
    p_min_rating numeric DEFAULT NULL,
    p_featured boolean DEFAULT NULL,
    p_limit integer DEFAULT 20,
    p_offset integer DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    business_name text,
    description text,
    category character varying,
    address character varying,
    city character varying,
    state character varying,
    zip_code character varying,
    website character varying,
    logo_url character varying,
    banner_url character varying,
    is_verified boolean,
    average_rating numeric,
    review_count integer,
    created_at timestamp with time zone,
    total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_query text;
    v_conditions text[] := ARRAY[]::text[];
    v_count bigint;
BEGIN
    -- Build conditions array
    IF p_search_term IS NOT NULL AND trim(p_search_term) != '' THEN
        v_conditions := array_append(v_conditions, 
            format('(business_name ILIKE %L OR category ILIKE %L OR address ILIKE %L)', 
                   '%' || trim(p_search_term) || '%',
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
    
    -- Get total count for pagination
    v_query := 'SELECT COUNT(*) FROM businesses';
    IF array_length(v_conditions, 1) > 0 THEN
        v_query := v_query || ' WHERE ' || array_to_string(v_conditions, ' AND ');
    END IF;
    
    EXECUTE v_query INTO v_count;
    
    -- Return filtered results
    RETURN QUERY EXECUTE format('
        SELECT 
            b.id,
            b.business_name,
            b.description,
            b.category,
            b.address,
            b.city,
            b.state,
            b.zip_code,
            b.website,
            b.logo_url,
            b.banner_url,
            b.is_verified,
            b.average_rating,
            b.review_count,
            b.created_at,
            %s::bigint as total_count
        FROM businesses b
        %s
        ORDER BY b.is_verified DESC, b.created_at DESC
        LIMIT %s OFFSET %s',
        v_count,
        CASE WHEN array_length(v_conditions, 1) > 0 
             THEN 'WHERE ' || array_to_string(v_conditions, ' AND ')
             ELSE '' END,
        COALESCE(p_limit, 20),
        COALESCE(p_offset, 0)
    );
END;
$$;

-- Grant access to the search function
GRANT EXECUTE ON FUNCTION public.search_public_businesses(text, text, numeric, boolean, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_public_businesses(text, text, numeric, boolean, integer, integer) TO anon;