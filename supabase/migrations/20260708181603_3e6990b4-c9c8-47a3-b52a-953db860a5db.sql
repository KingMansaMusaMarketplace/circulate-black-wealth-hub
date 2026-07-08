
-- 1) Backfill businesses_private from any values still on the public row
INSERT INTO public.businesses_private (business_id, owner_id, email, phone, latitude, longitude)
SELECT b.id, b.owner_id, b.email, b.phone, b.latitude, b.longitude
FROM public.businesses b
WHERE (b.email IS NOT NULL OR b.phone IS NOT NULL OR b.latitude IS NOT NULL OR b.longitude IS NOT NULL)
  AND b.owner_id IS NOT NULL
ON CONFLICT (business_id) DO UPDATE
SET email = COALESCE(public.businesses_private.email, EXCLUDED.email),
    phone = COALESCE(public.businesses_private.phone, EXCLUDED.phone),
    latitude = COALESCE(public.businesses_private.latitude, EXCLUDED.latitude),
    longitude = COALESCE(public.businesses_private.longitude, EXCLUDED.longitude);

-- 2) Null out sensitive columns on the public table
UPDATE public.businesses
SET email = NULL, phone = NULL, latitude = NULL, longitude = NULL
WHERE email IS NOT NULL OR phone IS NOT NULL OR latitude IS NOT NULL OR longitude IS NOT NULL;

-- 3) Sync trigger: move any future writes on these columns into businesses_private, keep public row blank
CREATE OR REPLACE FUNCTION public.sync_businesses_private_sensitive()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL AND (
    NEW.email IS NOT NULL OR NEW.phone IS NOT NULL OR
    NEW.latitude IS NOT NULL OR NEW.longitude IS NOT NULL
  ) THEN
    INSERT INTO public.businesses_private (business_id, owner_id, email, phone, latitude, longitude)
    VALUES (NEW.id, NEW.owner_id, NEW.email, NEW.phone, NEW.latitude, NEW.longitude)
    ON CONFLICT (business_id) DO UPDATE
    SET owner_id = EXCLUDED.owner_id,
        email = COALESCE(EXCLUDED.email, public.businesses_private.email),
        phone = COALESCE(EXCLUDED.phone, public.businesses_private.phone),
        latitude = COALESCE(EXCLUDED.latitude, public.businesses_private.latitude),
        longitude = COALESCE(EXCLUDED.longitude, public.businesses_private.longitude);
  END IF;

  NEW.email := NULL;
  NEW.phone := NULL;
  NEW.latitude := NULL;
  NEW.longitude := NULL;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_businesses_sync_private_sensitive ON public.businesses;
CREATE TRIGGER trg_businesses_sync_private_sensitive
BEFORE INSERT OR UPDATE OF email, phone, latitude, longitude ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.sync_businesses_private_sensitive();

COMMENT ON FUNCTION public.sync_businesses_private_sensitive() IS
  'Keeps email/phone/latitude/longitude out of the publicly-readable businesses table by mirroring writes into businesses_private (owner/admin-only).';
