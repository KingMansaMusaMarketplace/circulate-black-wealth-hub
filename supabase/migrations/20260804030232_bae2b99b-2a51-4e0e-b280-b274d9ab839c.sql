ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS black_owned_confidence numeric,
  ADD COLUMN IF NOT EXISTS black_owned_evidence text,
  ADD COLUMN IF NOT EXISTS ownership_reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS ownership_flagged boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.businesses.black_owned_confidence IS '0-1 confidence that the business is Black-owned, based on cited evidence only. Distinct from is_verified (which only means the business is real).';
COMMENT ON COLUMN public.businesses.black_owned_evidence IS 'Short cited source confirming Black ownership. NULL means unverified.';
COMMENT ON COLUMN public.businesses.ownership_flagged IS 'TRUE when Kayla could not confirm Black ownership and a human must review.';

CREATE INDEX IF NOT EXISTS idx_businesses_ownership_review
  ON public.businesses (ownership_reviewed_at NULLS FIRST)
  WHERE listing_status = 'live';

CREATE INDEX IF NOT EXISTS idx_businesses_ownership_flagged
  ON public.businesses (ownership_flagged)
  WHERE ownership_flagged = true;