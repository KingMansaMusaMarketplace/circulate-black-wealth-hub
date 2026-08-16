INSERT INTO public.businesses (
  owner_id, name, business_name, description, category, website, email, phone,
  listing_status, is_verified
)
SELECT
  'bd72a75e-1310-4f40-9c74-380443b09d9b'::uuid,
  t.directory_name,
  t.directory_name,
  'Partner directory / chamber organization supporting Black-owned businesses.' ||
    COALESCE(' Region: ' || NULLIF(t.location, ''), ''),
  'Partner Directory & Chamber',
  t.website,
  CASE WHEN t.contact_method = 'email' THEN NULLIF(t.contact_value, '') END,
  t.phone,
  'draft',
  false
FROM public.outreach_targets t
WHERE NOT EXISTS (
  SELECT 1 FROM public.businesses b WHERE lower(b.name) = lower(t.directory_name)
);

CREATE OR REPLACE FUNCTION public.list_partner_directories()
RETURNS TABLE(
  id uuid, name text, description text, website character varying,
  logo_url character varying, banner_url character varying
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT b.id, b.name, b.description, b.website, b.logo_url, b.banner_url
  FROM public.businesses b
  WHERE b.category = 'Partner Directory & Chamber'
  ORDER BY b.name;
$$;

REVOKE ALL ON FUNCTION public.list_partner_directories() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_partner_directories() TO anon, authenticated, service_role;