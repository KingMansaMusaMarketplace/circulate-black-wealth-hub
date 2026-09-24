CREATE OR REPLACE FUNCTION public.get_claim_campaign_candidates(_city text, _state text, _category text, _limit int)
RETURNS TABLE(id uuid, business_name text, email text, city text, state text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.id, coalesce(b.business_name, b.name), trim(coalesce(p.email, b.email)), b.city, b.state
  FROM businesses b LEFT JOIN businesses_private p ON p.business_id = b.id
  WHERE b.listing_status = 'live' AND b.claim_status = 'unclaimed' AND b.claim_invited_at IS NULL
    AND coalesce(p.email, b.email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (_city IS NULL OR b.city = _city)
    AND (_state IS NULL OR b.state = _state)
    AND (_category IS NULL OR b.category = _category)
  LIMIT _limit
$$;
REVOKE ALL ON FUNCTION public.get_claim_campaign_candidates(text,text,text,int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_claim_campaign_candidates(text,text,text,int) TO service_role;

CREATE OR REPLACE FUNCTION public.count_claim_ready()
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN public.has_role(auth.uid(),'admin') THEN (
    SELECT count(*) FROM businesses b LEFT JOIN businesses_private p ON p.business_id = b.id
    WHERE b.listing_status='live' AND b.claim_status='unclaimed' AND b.claim_invited_at IS NULL
      AND coalesce(p.email, b.email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$') ELSE 0 END
$$;
REVOKE ALL ON FUNCTION public.count_claim_ready() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.count_claim_ready() TO authenticated, service_role;

UPDATE business_claim_campaigns SET status='draft' WHERE id='13f94b6e-a996-43a6-8176-f1352b9835e6' AND total_sent=0;