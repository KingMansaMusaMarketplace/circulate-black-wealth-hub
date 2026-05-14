
-- 1. Revoke anonymous access to business owner contact info
REVOKE SELECT (email, phone) ON public.businesses FROM anon;

-- 2. Revoke authenticated direct SELECT of email/phone too (defense-in-depth)
--    Owners/admins fetch via the new RPC below.
REVOKE SELECT (email, phone) ON public.businesses FROM authenticated;

-- 3. Owner/manager/admin RPC to fetch their own business contact info
CREATE OR REPLACE FUNCTION public.get_business_owner_contact(p_business_id uuid)
RETURNS TABLE(email text, phone text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = p_business_id
      AND (
        b.owner_id = auth.uid()
        OR b.location_manager_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin'::app_role)
      )
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY SELECT b.email, b.phone FROM public.businesses b WHERE b.id = p_business_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_business_owner_contact(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_business_owner_contact(uuid) TO authenticated;

-- 4. Driver PII: revoke license plate and driver's license number column reads
REVOKE SELECT (drivers_license_number, license_plate) ON public.noir_drivers FROM anon, authenticated;

-- 5. Performance: index for owner_id lookups (fixes 15s timeout on dashboard)
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id
  ON public.businesses(owner_id, created_at DESC);
