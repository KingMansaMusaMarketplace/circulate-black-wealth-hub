CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_businesses_live_ranking
  ON public.businesses (is_verified DESC, average_rating DESC NULLS LAST, created_at DESC)
  WHERE listing_status = 'live';

CREATE INDEX IF NOT EXISTS idx_businesses_live_category
  ON public.businesses (category)
  WHERE listing_status = 'live';

CREATE INDEX IF NOT EXISTS idx_businesses_live_geo
  ON public.businesses (latitude, longitude)
  WHERE listing_status = 'live' AND latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_businesses_business_name_trgm
  ON public.businesses USING gin (business_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_businesses_name_trgm
  ON public.businesses USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_businesses_city_trgm
  ON public.businesses USING gin (city gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_businesses_state_trgm
  ON public.businesses USING gin (state gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_businesses_category_trgm
  ON public.businesses USING gin (category gin_trgm_ops);

ANALYZE public.businesses;