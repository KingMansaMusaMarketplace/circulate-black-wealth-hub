-- 1. Private table for claim tokens
CREATE TABLE IF NOT EXISTS public.businesses_claim_tokens (
  business_id uuid PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
  claim_token text,
  claim_token_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.businesses_claim_tokens TO service_role;

ALTER TABLE public.businesses_claim_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage business claim tokens"
ON public.businesses_claim_tokens
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_businesses_claim_tokens_token
  ON public.businesses_claim_tokens (claim_token);

-- 2. Migrate existing tokens
INSERT INTO public.businesses_claim_tokens (business_id, claim_token, claim_token_expires_at)
SELECT id, claim_token, claim_token_expires_at
FROM public.businesses
WHERE claim_token IS NOT NULL
ON CONFLICT (business_id) DO NOTHING;

-- 3. Drop the publicly-readable token columns
ALTER TABLE public.businesses DROP COLUMN IF EXISTS claim_token;
ALTER TABLE public.businesses DROP COLUMN IF EXISTS claim_token_expires_at;

CREATE OR REPLACE FUNCTION public.touch_businesses_claim_tokens()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_businesses_claim_tokens ON public.businesses_claim_tokens;
CREATE TRIGGER trg_touch_businesses_claim_tokens
BEFORE UPDATE ON public.businesses_claim_tokens
FOR EACH ROW EXECUTE FUNCTION public.touch_businesses_claim_tokens();

-- 4. Update token verification RPC
DROP FUNCTION IF EXISTS public.verify_business_claim_token(text);
CREATE FUNCTION public.verify_business_claim_token(p_token text)
RETURNS TABLE(id uuid, business_name text, city text, state text, category text, is_valid boolean, is_expired boolean)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT b.id,
    b.business_name::text,
    b.city::text,
    b.state::text,
    b.category::text,
    (t.claim_token_expires_at > now() AND b.claim_status IS DISTINCT FROM 'claimed') AS is_valid,
    (t.claim_token_expires_at <= now()) AS is_expired
  FROM public.businesses_claim_tokens t
  JOIN public.businesses b ON b.id = t.business_id
  WHERE t.claim_token = p_token
  LIMIT 1;
END;
$$;

REVOKE ALL ON FUNCTION public.verify_business_claim_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_business_claim_token(text) TO anon, authenticated, service_role;

-- 5. Update claim RPC
CREATE OR REPLACE FUNCTION public.claim_directory_business(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_biz RECORD;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'You must be signed in to claim a listing');
  END IF;

  SELECT b.id, b.business_name INTO v_biz
  FROM public.businesses_claim_tokens t
  JOIN public.businesses b ON b.id = t.business_id
  WHERE t.claim_token = p_token
    AND t.claim_token_expires_at > now()
    AND b.claim_status IS DISTINCT FROM 'claimed'
  FOR UPDATE OF b;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'This claim link is invalid, expired, or already used');
  END IF;

  UPDATE public.businesses
  SET owner_id = v_uid,
      claim_status = 'claimed',
      claimed_at = now()
  WHERE id = v_biz.id;

  DELETE FROM public.businesses_claim_tokens WHERE business_id = v_biz.id;

  UPDATE public.business_claim_invites
  SET claimed_at = now(), status = 'claimed'
  WHERE business_id = v_biz.id AND claimed_at IS NULL;

  RETURN jsonb_build_object('success', true, 'business_id', v_biz.id, 'business_name', v_biz.business_name);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_directory_business(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_directory_business(text) TO authenticated, service_role;