CREATE OR REPLACE FUNCTION public.get_leads_needing_enrichment(p_limit integer DEFAULT 500)
RETURNS TABLE (
  id uuid,
  business_name text,
  website_url text,
  owner_email text,
  phone_number text,
  contact_info jsonb,
  enrichment_attempts integer
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    id,
    business_name,
    website_url,
    owner_email,
    phone_number,
    contact_info,
    COALESCE(enrichment_attempts, 0) AS enrichment_attempts
  FROM public.b2b_external_leads
  WHERE website_url IS NOT NULL
    AND website_url <> ''
    AND (owner_email IS NULL OR owner_email = '')
    AND verification_status <> 'rejected'
  ORDER BY COALESCE(enrichment_attempts, 0) ASC, created_at ASC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_leads_needing_enrichment(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_leads_needing_enrichment(integer) TO service_role;
