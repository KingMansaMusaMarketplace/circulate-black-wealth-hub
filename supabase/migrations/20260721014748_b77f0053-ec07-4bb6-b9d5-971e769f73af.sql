
-- Fix 1: Scope business_availability reads to live/public businesses only
DROP POLICY IF EXISTS "Availability viewable by authenticated users" ON public.business_availability;
CREATE POLICY "Availability viewable for live businesses"
ON public.business_availability
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_availability.business_id
      AND (b.listing_status = 'live' OR b.owner_id = auth.uid())
  )
);

-- Fix 2: Rate-limit hotel-partner applications & bind created_by to caller
CREATE OR REPLACE FUNCTION public.enforce_noir_hotel_partner_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count int;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Bind created_by to the authenticated caller (ignore client-supplied)
  NEW.created_by := auth.uid();
  NEW.status := 'pending';
  NEW.approved_by := NULL;
  NEW.approved_at := NULL;

  -- Rate limit: max 3 submissions per user per 24 hours
  SELECT count(*) INTO recent_count
  FROM public.noir_hotel_partners
  WHERE created_by = auth.uid()
    AND created_at > now() - interval '24 hours';

  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded: max 3 hotel partner applications per 24 hours';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_noir_hotel_partner_insert_trg ON public.noir_hotel_partners;
CREATE TRIGGER enforce_noir_hotel_partner_insert_trg
BEFORE INSERT ON public.noir_hotel_partners
FOR EACH ROW
EXECUTE FUNCTION public.enforce_noir_hotel_partner_insert();
