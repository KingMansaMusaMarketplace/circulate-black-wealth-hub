ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS image_audit_at timestamptz,
  ADD COLUMN IF NOT EXISTS image_audit_result text;

CREATE INDEX IF NOT EXISTS idx_businesses_image_audit_pending
  ON public.businesses (id)
  WHERE image_audit_at IS NULL AND logo_url IS NOT NULL;

INSERT INTO public.internal_job_tokens (name, token)
VALUES ('image_audit', 'a41f2c7e9d0b4a6f8c31d57be2094ab7c6d8e1f0a2b3c4d5')
ON CONFLICT (name) DO NOTHING;