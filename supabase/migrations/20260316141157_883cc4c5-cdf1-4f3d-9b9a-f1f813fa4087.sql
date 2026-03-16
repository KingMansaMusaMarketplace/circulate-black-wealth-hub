
-- New RPC for paginated, filtered directory search
CREATE OR REPLACE FUNCTION search_directory_businesses(
  p_search_term TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_min_rating NUMERIC DEFAULT NULL,
  p_limit INT DEFAULT 24,
  p_offset INT DEFAULT 0
)
RETURNS TABLE(
  id UUID, business_name TEXT, name TEXT, description TEXT,
  category TEXT, address TEXT, city TEXT, state TEXT, zip_code TEXT,
  website TEXT, logo_url TEXT, banner_url TEXT, is_verified BOOLEAN,
  average_rating NUMERIC, review_count INT, latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ,
  listing_status TEXT, is_founding_member BOOLEAN, is_founding_sponsor BOOLEAN,
  total_count BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.id, b.business_name, b.name, b.description,
         b.category, b.address, b.city, b.state, b.zip_code,
         b.website, b.logo_url, b.banner_url, b.is_verified,
         b.average_rating, b.review_count::INT, b.latitude::DOUBLE PRECISION, b.longitude::DOUBLE PRECISION,
         b.created_at, b.updated_at, b.listing_status,
         b.is_founding_member, b.is_founding_sponsor,
         COUNT(*) OVER() AS total_count
  FROM businesses b
  WHERE b.listing_status = 'live'
    AND (p_search_term IS NULL OR
         b.business_name ILIKE '%' || p_search_term || '%' OR
         b.category ILIKE '%' || p_search_term || '%' OR
         b.description ILIKE '%' || p_search_term || '%')
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
  ORDER BY b.is_verified DESC, b.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$$;

-- Lightweight categories query
CREATE OR REPLACE FUNCTION get_directory_categories()
RETURNS TABLE(category TEXT, count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.category, COUNT(*) as count
  FROM businesses b
  WHERE b.listing_status = 'live' AND b.category IS NOT NULL
  GROUP BY b.category
  ORDER BY count DESC;
$$;
