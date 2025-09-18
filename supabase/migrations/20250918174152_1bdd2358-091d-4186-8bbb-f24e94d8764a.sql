-- Fix security definer view issues by removing problematic views and replacing with proper RLS

-- Drop the problematic views that use SECURITY DEFINER functions
DROP VIEW IF EXISTS public.business_directory;
DROP VIEW IF EXISTS public.business_directory_secure;

-- Drop the problematic SECURITY DEFINER function
DROP FUNCTION IF EXISTS public.get_public_business_info();

-- Create a safer view for public business listings that respects RLS
CREATE VIEW public.business_directory AS
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
  b.created_at
FROM businesses b;

-- Ensure proper RLS policy exists on businesses table for public viewing
-- This policy should already exist, but we'll recreate it to be safe
DROP POLICY IF EXISTS "Public can view business listings" ON public.businesses;
CREATE POLICY "Public can view business listings" 
ON public.businesses 
FOR SELECT 
TO public
USING (true);

-- Create a safer function for getting public business info (without SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_public_business_info()
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
  created_at timestamp with time zone
) 
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  -- This function now relies on RLS policies instead of SECURITY DEFINER
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
    b.created_at
  FROM businesses b;
$$;

-- Update the search function to work with the new approach
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
SET search_path = public
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
    
    -- Get total count for pagination - now queries businesses directly with RLS
    v_query := 'SELECT COUNT(*) FROM businesses';
    IF array_length(v_conditions, 1) > 0 THEN
        v_query := v_query || ' WHERE ' || array_to_string(v_conditions, ' AND ');
    END IF;
    
    EXECUTE v_query INTO v_count;
    
    -- Return filtered results from businesses table directly (respects RLS)
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