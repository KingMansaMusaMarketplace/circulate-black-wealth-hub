ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS website_status text NOT NULL DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS website_checked_at timestamptz,
  ADD COLUMN IF NOT EXISTS website_status_code integer,
  ADD COLUMN IF NOT EXISTS website_fail_count integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_businesses_website_status
  ON public.businesses (website_status, website_checked_at NULLS FIRST);