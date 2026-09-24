CREATE OR REPLACE FUNCTION public.get_claim_campaign_candidates(_city text, _state text, _category text, _limit integer)
 RETURNS TABLE(id uuid, business_name text, email text, city text, state text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT b.id, coalesce(b.business_name, b.name), trim(coalesce(p.email, b.email)), b.city, b.state
  FROM businesses b LEFT JOIN businesses_private p ON p.business_id = b.id
  WHERE b.listing_status = 'live' AND b.claim_status = 'unclaimed' AND b.claim_invited_at IS NULL
    AND coalesce(p.email, b.email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND NOT EXISTS (SELECT 1 FROM claim_email_optouts o WHERE o.email = lower(trim(coalesce(p.email, b.email))))
    AND (_city IS NULL OR b.city = _city)
    AND (_state IS NULL OR b.state = _state)
    AND (_category IS NULL OR b.category = _category)
  LIMIT _limit
$$;

CREATE OR REPLACE FUNCTION public.count_claim_ready()
 RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT CASE WHEN public.has_role(auth.uid(),'admin') THEN (
    SELECT count(*) FROM businesses b LEFT JOIN businesses_private p ON p.business_id = b.id
    WHERE b.listing_status='live' AND b.claim_status='unclaimed' AND b.claim_invited_at IS NULL
      AND coalesce(p.email, b.email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
      AND NOT EXISTS (SELECT 1 FROM claim_email_optouts o WHERE o.email = lower(trim(coalesce(p.email, b.email))))
  ) ELSE 0 END
$$;