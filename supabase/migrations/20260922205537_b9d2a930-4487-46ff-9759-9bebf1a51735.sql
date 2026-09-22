CREATE OR REPLACE FUNCTION public.get_lease_listing(p_id uuid)
RETURNS SETOF public.vacation_properties
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT *
  FROM public.vacation_properties
  WHERE id = p_id
    AND listing_mode = 'yearly_lease'
    AND is_active = true
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_lease_listing(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_lease_listing(uuid) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_similar_lease_listings(p_id uuid, p_city text, p_limit integer DEFAULT 4)
RETURNS SETOF public.vacation_properties
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT *
  FROM public.vacation_properties
  WHERE listing_mode = 'yearly_lease'
    AND is_active = true
    AND id <> p_id
    AND (p_city IS NULL OR city ILIKE p_city)
  ORDER BY is_verified DESC, created_at DESC
  LIMIT COALESCE(p_limit, 4);
$$;

REVOKE ALL ON FUNCTION public.get_similar_lease_listings(uuid, text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_similar_lease_listings(uuid, text, integer) TO anon, authenticated, service_role;