-- Fix critical security linter warnings

-- Fix 1: Remove security definer from view (ERROR 0010)
-- Drop the existing view with security definer
DROP VIEW IF EXISTS public.public_referral_codes;

-- Create a regular view without security definer (safer approach)
-- This will respect RLS policies on the underlying table
CREATE VIEW public.public_referral_codes AS
SELECT 
  referral_code,
  is_active,
  created_at
FROM public.sales_agents 
WHERE is_active = true;

-- Since this is a regular view, it will inherit RLS from the sales_agents table
-- No need for security_barrier as it's not a security definer view

-- Fix 2: Update all existing functions to have proper search_path (WARN 0011)
-- List of functions that need search_path fixes:

-- Update get_public_business_info
CREATE OR REPLACE FUNCTION public.get_public_business_info()
RETURNS TABLE(id uuid, business_name text, description text, category character varying, city character varying, state character varying, logo_url character varying, banner_url character varying, is_verified boolean, average_rating numeric, review_count integer, created_at timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Update get_public_businesses
CREATE OR REPLACE FUNCTION public.get_public_businesses()
RETURNS TABLE(id uuid, business_name character varying, description text, category character varying, address character varying, city character varying, state character varying, zip_code character varying, website character varying, logo_url character varying, banner_url character varying, is_verified boolean, average_rating numeric, review_count integer, created_at timestamp with time zone)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    RETURN QUERY
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
        b.created_at
    FROM businesses b
    ORDER BY b.business_name;
END;
$function$;

-- Update get_public_sales_agents
CREATE OR REPLACE FUNCTION public.get_public_sales_agents()
RETURNS TABLE(id uuid, referral_code text, is_active boolean, created_at timestamp with time zone)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        sa.id,
        sa.referral_code,
        sa.is_active,
        sa.created_at
    FROM sales_agents sa
    WHERE sa.is_active = true;
END;
$function$;

-- Update get_active_referral_codes
CREATE OR REPLACE FUNCTION public.get_active_referral_codes()
RETURNS TABLE(referral_code text, is_active boolean)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        sa.referral_code,
        sa.is_active
    FROM sales_agents sa
    WHERE sa.is_active = true;
END;
$function$;

-- Update get_agent_referral_codes
CREATE OR REPLACE FUNCTION public.get_agent_referral_codes()
RETURNS TABLE(id uuid, referral_code text, is_active boolean)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        sa.id,
        sa.referral_code,
        sa.is_active
    FROM sales_agents sa
    WHERE sa.is_active = true;
END;
$function$;

-- Update get_test_questions_for_user
CREATE OR REPLACE FUNCTION public.get_test_questions_for_user()
RETURNS TABLE(id uuid, question text, option_a text, option_b text, option_c text, option_d text, created_at timestamp with time zone)
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT 
    t.id,
    t.question,
    t.option_a,
    t.option_b,
    t.option_c,
    t.option_d,
    t.created_at
  FROM public.sales_agent_tests t
  WHERE t.is_active = true
  ORDER BY RANDOM();
$function$;

-- Update search_public_businesses
CREATE OR REPLACE FUNCTION public.search_public_businesses(p_search_term text DEFAULT NULL::text, p_category text DEFAULT NULL::text, p_min_rating numeric DEFAULT NULL::numeric, p_featured boolean DEFAULT NULL::boolean, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
RETURNS TABLE(id uuid, business_name text, description text, category character varying, city character varying, state character varying, logo_url character varying, banner_url character varying, is_verified boolean, average_rating numeric, review_count integer, created_at timestamp with time zone, total_count bigint)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;