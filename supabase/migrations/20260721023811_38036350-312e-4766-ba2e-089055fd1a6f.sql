
-- Hide business owner PII (email, phone, address, latitude, longitude) from
-- anonymous and general authenticated users. Owners/admins keep access via
-- the businesses_private table (address column added below) and existing
-- owner/admin RLS policies on the base table (which still hold row access,
-- but column privileges below block PII reads for public-facing roles).

-- 1. Ensure businesses_private has address so owners have a place to store/read it.
ALTER TABLE public.businesses_private
  ADD COLUMN IF NOT EXISTS address text;

-- 2. Backfill businesses_private with sensitive fields from businesses for
--    every business that has an owner_id, so owner dashboards keep working.
INSERT INTO public.businesses_private (business_id, owner_id, email, phone, address, latitude, longitude)
SELECT b.id, b.owner_id, b.email, b.phone, b.address, b.latitude, b.longitude
FROM public.businesses b
WHERE b.owner_id IS NOT NULL
ON CONFLICT (business_id) DO UPDATE
SET email = COALESCE(public.businesses_private.email, EXCLUDED.email),
    phone = COALESCE(public.businesses_private.phone, EXCLUDED.phone),
    address = COALESCE(public.businesses_private.address, EXCLUDED.address),
    latitude = COALESCE(public.businesses_private.latitude, EXCLUDED.latitude),
    longitude = COALESCE(public.businesses_private.longitude, EXCLUDED.longitude),
    updated_at = now();

-- 3. Revoke column-level SELECT on the sensitive columns from public-facing
--    roles. Column privileges are enforced in addition to RLS, so this stops
--    ANY SELECT that references these columns from anon or authenticated.
--    service_role (used by edge functions) is unaffected.
REVOKE SELECT (email, phone, address, latitude, longitude)
  ON public.businesses FROM anon, authenticated, PUBLIC;

-- 4. Provide a SECURITY DEFINER helper so owners/admins can fetch their own
--    business's sensitive fields in one call without hitting the base table.
CREATE OR REPLACE FUNCTION public.get_business_private_fields(_business_id uuid)
RETURNS TABLE (
  business_id uuid,
  email text,
  phone text,
  address text,
  latitude numeric,
  longitude numeric
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = _business_id
      AND (
        b.owner_id = auth.uid()
        OR b.location_manager_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin'::app_role)
      )
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT bp.business_id,
         bp.email,
         bp.phone,
         bp.address,
         bp.latitude::numeric,
         bp.longitude::numeric
  FROM public.businesses_private bp
  WHERE bp.business_id = _business_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_business_private_fields(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_business_private_fields(uuid) TO authenticated;
