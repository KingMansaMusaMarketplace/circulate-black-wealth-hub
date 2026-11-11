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
    AND b.listing_status = 'live'
  ORDER BY b.name;
$$;

REVOKE ALL ON FUNCTION public.list_partner_directories() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_partner_directories() TO anon, authenticated, service_role;