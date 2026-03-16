
CREATE OR REPLACE FUNCTION get_directory_map_markers(
  p_search_term TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_min_rating NUMERIC DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  business_name TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  category TEXT,
  average_rating NUMERIC
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.id, b.business_name, b.latitude, b.longitude, b.category, b.average_rating
  FROM businesses b
  WHERE b.listing_status = 'live'
    AND b.latitude IS NOT NULL
    AND b.longitude IS NOT NULL
    AND (p_search_term IS NULL OR
         b.business_name ILIKE '%' || p_search_term || '%' OR
         b.category ILIKE '%' || p_search_term || '%' OR
         b.description ILIKE '%' || p_search_term || '%')
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
  ORDER BY b.is_verified DESC, b.created_at DESC;
$$;
