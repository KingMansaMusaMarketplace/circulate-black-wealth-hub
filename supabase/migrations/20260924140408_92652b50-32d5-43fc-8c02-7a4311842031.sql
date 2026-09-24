CREATE OR REPLACE FUNCTION public.count_claim_ready()
 RETURNS bigint LANGUAGE plpgsql STABLE SECURITY DEFINER
 SET search_path TO 'public' SET statement_timeout TO '30s'
AS $$
DECLARE n bigint;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RETURN 0; END IF;
  WITH x AS (
    SELECT b.claim_invited_at, lower(trim(coalesce(p.email, b.email))) em
    FROM businesses b LEFT JOIN businesses_private p ON p.business_id=b.id
    WHERE b.listing_status='live' AND b.claim_status='unclaimed'
  ), shared AS (SELECT em FROM x WHERE em IS NOT NULL GROUP BY em HAVING count(*)>1)
  SELECT count(*) INTO n FROM x
  WHERE x.claim_invited_at IS NULL AND x.em ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND NOT EXISTS (SELECT 1 FROM shared s WHERE s.em=x.em)
    AND NOT EXISTS (SELECT 1 FROM claim_email_optouts o WHERE o.email=x.em);
  RETURN n;
END $$;
ALTER FUNCTION public.get_claim_campaign_candidates(text,text,text,integer) SET statement_timeout TO '60s';