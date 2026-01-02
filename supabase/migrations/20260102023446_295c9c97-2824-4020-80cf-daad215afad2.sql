-- Create table for caching B2B web search results (24hr TTL)
CREATE TABLE public.b2b_web_search_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash TEXT NOT NULL UNIQUE,
  query_text TEXT NOT NULL,
  category TEXT,
  location TEXT,
  results JSONB NOT NULL DEFAULT '[]'::jsonb,
  citations TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '24 hours')
);

-- Enable RLS
ALTER TABLE public.b2b_web_search_cache ENABLE ROW LEVEL SECURITY;

-- Anyone can read cache (public search results)
CREATE POLICY "Anyone can read search cache"
ON public.b2b_web_search_cache
FOR SELECT
USING (true);

-- Only edge functions can insert/update cache (service role)
CREATE POLICY "Service role can manage cache"
ON public.b2b_web_search_cache
FOR ALL
USING (auth.role() = 'service_role');

-- Index for faster lookups
CREATE INDEX idx_b2b_search_cache_hash ON public.b2b_web_search_cache(query_hash);
CREATE INDEX idx_b2b_search_cache_expires ON public.b2b_web_search_cache(expires_at);

-- Function to clean expired cache entries (can be called by cron)
CREATE OR REPLACE FUNCTION public.cleanup_expired_search_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.b2b_web_search_cache
  WHERE expires_at < now();
END;
$$;