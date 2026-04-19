CREATE TABLE IF NOT EXISTS public.youtube_video_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,
  videos JSONB NOT NULL,
  channel_id TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.youtube_video_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "YouTube cache is publicly readable"
  ON public.youtube_video_cache
  FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_youtube_video_cache_key ON public.youtube_video_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_youtube_video_cache_expires ON public.youtube_video_cache(expires_at);

CREATE TRIGGER update_youtube_video_cache_updated_at
  BEFORE UPDATE ON public.youtube_video_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();