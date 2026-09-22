CREATE OR REPLACE FUNCTION public.get_social_share_counts(p_business_id uuid)
RETURNS TABLE(platform text, share_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT s.platform::text, count(*)::bigint
  FROM public.social_shares s
  WHERE s.business_id = p_business_id
  GROUP BY s.platform;
$$;

REVOKE ALL ON FUNCTION public.get_social_share_counts(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_social_share_counts(uuid) TO anon, authenticated, service_role;
