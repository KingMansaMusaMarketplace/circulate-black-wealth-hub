
CREATE OR REPLACE FUNCTION public.verify_business_claim_token(p_token text)
RETURNS TABLE(business_id uuid, business_name text, city text, state text, category text, is_valid boolean, is_expired boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT b.id,
    b.business_name::text,
    b.city::text,
    b.state::text,
    b.category::text,
    (b.claim_token = p_token AND b.claim_token_expires_at > now() AND b.claim_status <> 'claimed') AS is_valid,
    (b.claim_token = p_token AND b.claim_token_expires_at <= now()) AS is_expired
  FROM public.businesses b
  WHERE b.claim_token = p_token
  LIMIT 1;
END; $$;

REVOKE EXECUTE ON FUNCTION public.verify_business_claim_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_business_claim_token(text) TO anon, authenticated, service_role;
