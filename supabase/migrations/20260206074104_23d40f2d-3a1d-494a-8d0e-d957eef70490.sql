-- Update function to use correct listing_status value 'live'
DROP FUNCTION IF EXISTS get_nearby_businesses;

CREATE OR REPLACE FUNCTION get_nearby_businesses(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_miles DOUBLE PRECISION DEFAULT 0.5
)
RETURNS TABLE (
  id UUID,
  business_name VARCHAR,
  category VARCHAR,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_miles DOUBLE PRECISION,
  logo_url VARCHAR,
  discount VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.business_name,
    b.category,
    b.latitude::DOUBLE PRECISION,
    b.longitude::DOUBLE PRECISION,
    -- Haversine formula for distance in miles
    (3959 * ACOS(
      LEAST(1.0, GREATEST(-1.0,
        COS(RADIANS(user_lat)) * COS(RADIANS(b.latitude)) * 
        COS(RADIANS(b.longitude) - RADIANS(user_lng)) + 
        SIN(RADIANS(user_lat)) * SIN(RADIANS(b.latitude))
      ))
    ))::DOUBLE PRECISION AS distance_miles,
    b.logo_url,
    NULL::VARCHAR AS discount
  FROM businesses b
  WHERE 
    b.latitude IS NOT NULL 
    AND b.longitude IS NOT NULL
    AND (b.listing_status = 'live' OR b.listing_status = 'active' OR b.listing_status IS NULL)
    -- Pre-filter with bounding box for performance (rough ~1 degree = 69 miles)
    AND b.latitude BETWEEN user_lat - (radius_miles / 69.0) AND user_lat + (radius_miles / 69.0)
    AND b.longitude BETWEEN user_lng - (radius_miles / 69.0) AND user_lng + (radius_miles / 69.0)
    -- Final precise Haversine filter
    AND (3959 * ACOS(
      LEAST(1.0, GREATEST(-1.0,
        COS(RADIANS(user_lat)) * COS(RADIANS(b.latitude)) * 
        COS(RADIANS(b.longitude) - RADIANS(user_lng)) + 
        SIN(RADIANS(user_lat)) * SIN(RADIANS(b.latitude))
      ))
    )) <= radius_miles
  ORDER BY distance_miles ASC
  LIMIT 10;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION get_nearby_businesses TO authenticated;
GRANT EXECUTE ON FUNCTION get_nearby_businesses TO anon;