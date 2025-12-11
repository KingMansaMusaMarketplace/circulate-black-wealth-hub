-- Drop existing function first (has different return type)
DROP FUNCTION IF EXISTS public.get_directory_businesses(INTEGER, INTEGER);

-- Create secure function for public directory access
-- This function explicitly excludes sensitive ownership fields
CREATE OR REPLACE FUNCTION public.get_directory_businesses(
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  business_name TEXT,
  name TEXT,
  description TEXT,
  category TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  website TEXT,
  logo_url TEXT,
  banner_url TEXT,
  is_verified BOOLEAN,
  average_rating NUMERIC,
  review_count INTEGER,
  location_type TEXT,
  location_name TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Return only public-safe fields (excludes owner_id, location_manager_id, 
  -- parent_business_id, subscription fields, referral fields, phone, email)
  RETURN QUERY
  SELECT 
    b.id,
    b.business_name,
    b.name,
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
    b.location_type,
    b.location_name,
    b.created_at,
    b.updated_at
  FROM businesses b
  WHERE b.is_verified = true
  ORDER BY b.average_rating DESC NULLS LAST, b.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Create secure function for searching businesses (public access)
CREATE OR REPLACE FUNCTION public.search_directory_businesses(
  p_search_term TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  business_name TEXT,
  name TEXT,
  description TEXT,
  category TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  website TEXT,
  logo_url TEXT,
  banner_url TEXT,
  is_verified BOOLEAN,
  average_rating NUMERIC,
  review_count INTEGER,
  location_type TEXT,
  location_name TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.business_name,
    b.name,
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
    b.location_type,
    b.location_name,
    b.created_at,
    b.updated_at
  FROM businesses b
  WHERE b.is_verified = true
    AND (p_search_term IS NULL OR 
         b.business_name ILIKE '%' || p_search_term || '%' OR
         b.description ILIKE '%' || p_search_term || '%' OR
         b.category ILIKE '%' || p_search_term || '%')
    AND (p_category IS NULL OR b.category = p_category)
    AND (p_city IS NULL OR b.city ILIKE p_city)
    AND (p_state IS NULL OR b.state ILIKE p_state)
  ORDER BY b.average_rating DESC NULLS LAST, b.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Grant execute permissions to public (anon and authenticated users)
GRANT EXECUTE ON FUNCTION public.get_directory_businesses(INTEGER, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_directory_businesses(TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER) TO anon, authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION public.get_directory_businesses IS 'Secure function for public directory access - excludes owner_id, contact info, and financial data';
COMMENT ON FUNCTION public.search_directory_businesses IS 'Secure search function for public directory - excludes sensitive ownership and financial fields';