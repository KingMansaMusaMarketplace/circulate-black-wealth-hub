
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS listing_rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS listing_reviewed_by UUID,
  ADD COLUMN IF NOT EXISTS listing_reviewed_at TIMESTAMPTZ;
