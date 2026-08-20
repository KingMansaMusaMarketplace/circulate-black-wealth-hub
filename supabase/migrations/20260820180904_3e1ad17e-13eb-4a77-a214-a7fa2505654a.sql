CREATE TABLE IF NOT EXISTS public.zip_centroids (
  zip text PRIMARY KEY,
  city text,
  state text,
  lat numeric NOT NULL,
  lon numeric NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_zip_centroids_city_state ON public.zip_centroids (lower(city), upper(state));

GRANT SELECT ON public.zip_centroids TO anon;
GRANT SELECT ON public.zip_centroids TO authenticated;
GRANT ALL ON public.zip_centroids TO service_role;

ALTER TABLE public.zip_centroids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "zip_centroids_public_read" ON public.zip_centroids;
CREATE POLICY "zip_centroids_public_read" ON public.zip_centroids FOR SELECT USING (true);