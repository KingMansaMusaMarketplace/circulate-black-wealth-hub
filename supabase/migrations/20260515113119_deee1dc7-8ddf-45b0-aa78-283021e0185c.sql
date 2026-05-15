ALTER TABLE public.broadcast_announcements
  ADD COLUMN IF NOT EXISTS target_filters jsonb NOT NULL DEFAULT '{}'::jsonb;