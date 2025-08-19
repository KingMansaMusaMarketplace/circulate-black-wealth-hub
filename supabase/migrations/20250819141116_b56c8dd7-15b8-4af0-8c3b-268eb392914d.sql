-- Fix Function Search Path Mutable issue
-- Update function to have explicit search_path setting

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
  business_name text,
  description text,
  category character varying,
  city character varying,
  state character varying,
  logo_url character varying,
  banner_url character varying,
  is_verified boolean,
  average_rating numeric,
  review_count integer,
  created_at timestamp with time zone,
  total_count bigint
)
LANGUAGE plpgsql
STABLE
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
    
    -- Get total count for pagination
    v_query := 'SELECT COUNT(*) FROM business_directory';
    IF array_length(v_conditions, 1) > 0 THEN
        v_query := v_query || ' WHERE ' || array_to_string(v_conditions, ' AND ');
    END IF;
    
    EXECUTE v_query INTO v_count;
    
    -- Return filtered results from business_directory view
    RETURN QUERY EXECUTE format('
        SELECT 
            bd.id,
            bd.business_name,
            bd.description,
            bd.category,
            bd.city,
            bd.state,
            bd.logo_url,
            bd.banner_url,
            bd.is_verified,
            bd.average_rating,
            bd.review_count,
            bd.created_at,
            %s::bigint as total_count
        FROM business_directory bd
        %s
        ORDER BY bd.is_verified DESC, bd.created_at DESC
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