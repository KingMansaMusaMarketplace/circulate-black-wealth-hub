CREATE TABLE public.sitemap_refresh_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ran_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL,
  sitemaps_warmed JSONB,
  indexnow_status INTEGER,
  indexnow_response TEXT,
  error TEXT,
  duration_ms INTEGER
);

CREATE INDEX idx_sitemap_refresh_log_ran_at ON public.sitemap_refresh_log(ran_at DESC);

ALTER TABLE public.sitemap_refresh_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sitemap refresh logs"
ON public.sitemap_refresh_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));