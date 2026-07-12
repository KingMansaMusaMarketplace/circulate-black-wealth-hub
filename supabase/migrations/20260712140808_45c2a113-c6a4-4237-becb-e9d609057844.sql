
-- 1) Fill missing private rows from businesses
INSERT INTO public.businesses_private (business_id, owner_id, phone, email, latitude, longitude)
SELECT b.id, b.owner_id, b.phone, b.email, b.latitude, b.longitude
FROM public.businesses b
WHERE b.owner_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.businesses_private p WHERE p.business_id = b.id)
  AND (b.phone IS NOT NULL OR b.email IS NOT NULL OR b.latitude IS NOT NULL OR b.longitude IS NOT NULL);

-- 2) Merge into existing private rows (do not overwrite non-null private values)
UPDATE public.businesses_private p
SET phone = COALESCE(p.phone, b.phone),
    email = COALESCE(p.email, b.email),
    latitude = COALESCE(p.latitude, b.latitude),
    longitude = COALESCE(p.longitude, b.longitude),
    updated_at = now()
FROM public.businesses b
WHERE p.business_id = b.id
  AND (
    (p.phone IS NULL AND b.phone IS NOT NULL) OR
    (p.email IS NULL AND b.email IS NOT NULL) OR
    (p.latitude IS NULL AND b.latitude IS NOT NULL) OR
    (p.longitude IS NULL AND b.longitude IS NOT NULL)
  );

-- 3) Null out sensitive columns on public businesses
UPDATE public.businesses
SET phone = NULL, email = NULL, latitude = NULL, longitude = NULL
WHERE phone IS NOT NULL OR email IS NOT NULL OR latitude IS NOT NULL OR longitude IS NOT NULL;

-- 4) Restrict qr_codes visibility to owners/admins only
DROP POLICY IF EXISTS "Authenticated users can view active QR codes" ON public.qr_codes;
