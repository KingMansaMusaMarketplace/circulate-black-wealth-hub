ALTER TABLE public.kayla_learnings
  ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS verification_note TEXT;

-- Preserve everything Kayla already knows: existing lessons stay trusted.
UPDATE public.kayla_learnings
  SET verified = true, verified_at = COALESCE(verified_at, created_at)
  WHERE verified = false;

CREATE INDEX IF NOT EXISTS kayla_learnings_verified_idx
  ON public.kayla_learnings (business_id, verified, confidence DESC, created_at DESC);