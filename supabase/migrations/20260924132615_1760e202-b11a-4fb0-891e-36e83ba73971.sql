
-- 1. Block owner/test/demo addresses from campaigns
INSERT INTO public.claim_email_optouts(email)
SELECT e FROM unnest(array['tbowling@nogreenthumb.com','tbowlilng@nogreenthumb.com','demo@mansamusa.com','qa+harpervine.20260510@1325.ai']) e
ON CONFLICT (email) DO NOTHING;

-- 2. Undo website-found emails shared by 2+ businesses (font designers, booking platforms, directories)
WITH s AS (SELECT email FROM public.businesses_private WHERE email_source='found on website' GROUP BY 1 HAVING count(*)>=2)
UPDATE public.businesses_private p
SET email='contact@mansamusamarketplace.com', email_source=NULL, email_check_result='shared_junk'
WHERE p.email_source='found on website' AND p.email IN (SELECT email FROM s);

-- 3. Campaign lists: skip listings owned by an account, and any email shared by 2+ businesses
CREATE OR REPLACE FUNCTION public.get_claim_campaign_candidates(_city text, _state text, _category text, _limit integer)
RETURNS TABLE(id uuid, business_name text, email text, city text, state text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  WITH x AS (
    SELECT b.*, lower(trim(coalesce(p.email, b.email))) em
    FROM businesses b LEFT JOIN businesses_private p ON p.business_id=b.id
    WHERE b.listing_status='live' AND b.claim_status='unclaimed' AND b.owner_id IS NULL
  ), shared AS (SELECT em FROM x GROUP BY em HAVING count(*)>1)
  SELECT x.id, coalesce(x.business_name, x.name), x.em, x.city, x.state FROM x
  WHERE x.claim_invited_at IS NULL
    AND x.em ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND x.em NOT IN (SELECT em FROM shared WHERE em IS NOT NULL)
    AND NOT EXISTS (SELECT 1 FROM claim_email_optouts o WHERE o.email=x.em)
    AND (_city IS NULL OR x.city=_city) AND (_state IS NULL OR x.state=_state) AND (_category IS NULL OR x.category=_category)
  LIMIT _limit
$$;

CREATE OR REPLACE FUNCTION public.count_claim_ready()
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT CASE WHEN public.has_role(auth.uid(),'admin') THEN (
    SELECT count(*) FROM public.get_claim_campaign_candidates(NULL,NULL,NULL,1000000)
  ) ELSE 0 END
$$;
