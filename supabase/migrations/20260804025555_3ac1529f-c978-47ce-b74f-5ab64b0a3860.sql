ALTER TABLE public.b2b_external_leads
  ADD COLUMN IF NOT EXISTS black_owned_confidence numeric,
  ADD COLUMN IF NOT EXISTS black_owned_evidence text;

COMMENT ON COLUMN public.b2b_external_leads.black_owned_confidence IS '0-1 AI confidence that the business is Black-owned (separate from confidence_score, which only measures that the business exists).';
COMMENT ON COLUMN public.b2b_external_leads.black_owned_evidence IS 'Short cited evidence of Black ownership (e.g. directory listing, owner bio, MBE certification). Null means unverified.';

CREATE INDEX IF NOT EXISTS idx_b2b_leads_black_owned_conf
  ON public.b2b_external_leads (black_owned_confidence);