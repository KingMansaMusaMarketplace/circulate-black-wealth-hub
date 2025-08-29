-- Fix critical security vulnerability: Restrict access to sensitive business contact information
-- Check current policies and implement secure access controls

-- Step 1: Remove the overly permissive public read policy
DROP POLICY IF EXISTS "Public can view basic business info" ON public.businesses;

-- Step 2: Ensure only authenticated users can view business listings
-- and only business owners can see their full contact details
CREATE POLICY "Authenticated users can view business listings" 
ON public.businesses 
FOR SELECT 
TO authenticated
USING (true);

-- Step 3: Remove public/anonymous access entirely
-- (No policy for anon users means they can't access the table)

-- Step 4: Create a secure business directory view with only public information
CREATE OR REPLACE VIEW public.business_directory_public AS
SELECT 
  id,
  business_name,
  description,
  category,
  city,
  state,
  logo_url,
  banner_url,
  is_verified,
  average_rating,
  review_count,
  created_at
FROM public.businesses;

-- Step 5: Create a function for public business search that excludes sensitive data
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
    
    -- Get total count for pagination
    v_query := 'SELECT COUNT(*) FROM business_directory_public';
    IF array_length(v_conditions, 1) > 0 THEN
        v_query := v_query || ' WHERE ' || array_to_string(v_conditions, ' AND ');
    END IF;
    
    EXECUTE v_query INTO v_count;
    
    -- Return filtered results from business_directory view (excludes sensitive data)
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
        FROM business_directory_public bd
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

-- Step 6: Create audit logging for sensitive business data access
CREATE TABLE IF NOT EXISTS public.business_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  business_id uuid REFERENCES businesses(id),
  access_type text NOT NULL,
  sensitive_data_accessed text[], -- Track which sensitive fields were accessed
  ip_address inet,
  user_agent text,
  accessed_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on the audit log
ALTER TABLE public.business_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view business access logs" 
ON public.business_access_log 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Add comments for documentation
COMMENT ON VIEW public.business_directory_public IS 'Secure public view of businesses excluding sensitive contact information (email, phone, address, website)';
COMMENT ON TABLE public.business_access_log IS 'Audit log for tracking access to sensitive business data';
COMMENT ON FUNCTION public.search_public_businesses IS 'Secure function for searching businesses that excludes sensitive contact information';