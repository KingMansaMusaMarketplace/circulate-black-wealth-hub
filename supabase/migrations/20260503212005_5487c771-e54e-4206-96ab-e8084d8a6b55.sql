-- Revoke direct column access to claim token fields from authenticated users
REVOKE SELECT (claim_token, claim_token_expires_at) ON public.b2b_external_leads FROM authenticated;
REVOKE SELECT (claim_token, claim_token_expires_at) ON public.b2b_external_leads FROM anon;

-- Secure verifier: returns lead metadata only when token is valid & unexpired
CREATE OR REPLACE FUNCTION public.verify_claim_token(p_token text)
RETURNS TABLE (
  lead_id uuid,
  business_name text,
  business_description text,
  category text,
  location text,
  website_url text,
  is_valid boolean,
  is_expired boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.business_name,
    l.business_description,
    l.category,
    l.location,
    l.website_url,
    (l.claim_token = p_token AND l.claim_token_expires_at > now() AND l.is_converted = false) AS is_valid,
    (l.claim_token = p_token AND l.claim_token_expires_at <= now()) AS is_expired
  FROM public.b2b_external_leads l
  WHERE l.claim_token = p_token
  LIMIT 1;
END;
$$;

REVOKE ALL ON FUNCTION public.verify_claim_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_claim_token(text) TO authenticated, anon;