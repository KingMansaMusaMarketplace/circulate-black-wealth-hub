ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS is_request boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS requested_service text;