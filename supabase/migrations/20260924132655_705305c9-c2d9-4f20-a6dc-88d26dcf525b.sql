
CREATE OR REPLACE FUNCTION public.get_claim_campaign_candidates(_city text, _state text, _category text, _limit integer)
RETURNS TABLE(id uuid, business_name text, email text, city text, state text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  WITH x AS (
    SELECT b.*, lower(trim(coalesce(p.email, b.email))) em
    FROM businesses b LEFT JOIN businesses_private p ON p.business_id=b.id
    WHERE b.listing_status='live' AND b.claim_status='unclaimed'
  ), shared AS (SELECT em FROM x WHERE em IS NOT NULL GROUP BY em HAVING count(*)>1)
  SELECT x.id, coalesce(x.business_name, x.name), x.em, x.city, x.state FROM x
  WHERE x.claim_invited_at IS NULL
    AND x.em ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND NOT EXISTS (SELECT 1 FROM shared s WHERE s.em=x.em)
    AND NOT EXISTS (SELECT 1 FROM claim_email_optouts o WHERE o.email=x.em)
    AND (_city IS NULL OR x.city=_city) AND (_state IS NULL OR x.state=_state) AND (_category IS NULL OR x.category=_category)
  LIMIT _limit
$$;
