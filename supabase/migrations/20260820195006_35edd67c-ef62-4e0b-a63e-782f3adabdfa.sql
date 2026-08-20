CREATE OR REPLACE FUNCTION public.sync_businesses_private_sensitive()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  -- Keep only APPROXIMATE (neighbourhood-level, ~100m) coordinates public so
  -- map + near-me search work; exact coordinates stay in businesses_private.
  NEW.latitude := round(NEW.latitude::numeric, 3);
  NEW.longitude := round(NEW.longitude::numeric, 3);

  RETURN NEW;
END;
$function$;

UPDATE public.businesses b
SET latitude = round(p.latitude::numeric, 3),
    longitude = round(p.longitude::numeric, 3)
FROM public.businesses_private p
WHERE p.business_id = b.id
  AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
  AND b.latitude IS DISTINCT FROM round(p.latitude::numeric, 3);

CREATE INDEX IF NOT EXISTS idx_businesses_lat_lng ON public.businesses (latitude, longitude);