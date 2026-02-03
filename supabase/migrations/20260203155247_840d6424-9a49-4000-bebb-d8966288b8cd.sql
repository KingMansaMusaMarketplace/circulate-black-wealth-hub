-- Add latitude and longitude columns to businesses table for map functionality
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add an index for geographic queries
CREATE INDEX IF NOT EXISTS idx_businesses_location ON public.businesses (latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Add a comment explaining the columns
COMMENT ON COLUMN public.businesses.latitude IS 'Business latitude coordinate for map display';
COMMENT ON COLUMN public.businesses.longitude IS 'Business longitude coordinate for map display';