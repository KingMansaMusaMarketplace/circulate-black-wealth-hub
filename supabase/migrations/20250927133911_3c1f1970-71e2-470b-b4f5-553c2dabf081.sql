-- Remove overly permissive policies from businesses table that expose owner contact details
DROP POLICY IF EXISTS "Authenticated users can view business listings" ON public.businesses;
DROP POLICY IF EXISTS "Public can view business listings" ON public.businesses;

-- Create secure policies that protect owner contact information
-- Only expose safe business information publicly, not owner details

-- Policy for public to view only safe business listing information (no owner contact details)
CREATE POLICY "Public can view safe business listing data" 
ON public.businesses 
FOR SELECT 
USING (true);

-- However, we need to ensure the SELECT only returns safe columns
-- Let's create a secure view/function instead and remove even this policy
DROP POLICY IF EXISTS "Public can view safe business listing data" ON public.businesses;

-- Create a secure function for public business listings that only returns safe data
CREATE OR REPLACE FUNCTION public.get_safe_business_listings()
RETURNS TABLE(
  id uuid,
  business_name character varying,
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
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  -- Return only safe business data, excluding owner contact information
  SELECT 
    b.id,
    b.business_name,
    b.description,
    b.category,
    b.address,
    b.city,
    b.state,
    b.zip_code,
    b.website,  -- Website is generally public info
    b.logo_url,
    b.banner_url,
    b.is_verified,
    b.average_rating,
    b.review_count,
    b.created_at
    -- Explicitly excluding: owner_id, phone, email (sensitive owner contact info)
  FROM public.businesses b
  ORDER BY b.is_verified DESC, b.business_name ASC;
$function$;

-- Update the existing search function to also exclude sensitive data
CREATE OR REPLACE FUNCTION public.search_safe_businesses(
  p_search_term text DEFAULT NULL::text, 
  p_category text DEFAULT NULL::text, 
  p_min_rating numeric DEFAULT NULL::numeric, 
  p_featured boolean DEFAULT NULL::boolean, 
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
  created_at timestamp with time zone,
  total_count bigint
)
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
    
    -- Get total count (using safe query without sensitive data)
    v_query := 'SELECT COUNT(*) FROM businesses';
    IF array_length(v_conditions, 1) > 0 THEN
        v_query := v_query || ' WHERE ' || array_to_string(v_conditions, ' AND ');
    END IF;
    
    EXECUTE v_query INTO v_count;
    
    -- Return filtered results with only safe fields (no owner contact info)
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

-- Ensure proper policies are maintained for business owners and admins
-- Business owners can still access their complete business data
-- Admins can view all business data for management purposes
-- The existing policies for these should already be in place, but let's verify

DO $$
BEGIN
  -- Ensure business owners can access their complete data
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'businesses' 
    AND policyname = 'Business owners can access their complete business data'
  ) THEN
    CREATE POLICY "Business owners can access their complete business data" 
    ON public.businesses 
    FOR ALL 
    USING (auth.uid() = owner_id) 
    WITH CHECK (auth.uid() = owner_id);
  END IF;
  
  -- Ensure admins can view all business data
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'businesses' 
    AND policyname = 'Admins can view all business data'
  ) THEN
    CREATE POLICY "Admins can view all business data" 
    ON public.businesses 
    FOR ALL 
    USING (is_admin_secure());
  END IF;
END $$;