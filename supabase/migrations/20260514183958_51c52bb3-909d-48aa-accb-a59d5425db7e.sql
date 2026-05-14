
-- Restore business-owner read on bookings (no Stripe IDs leak now thanks to column revoke below)
CREATE POLICY "Business owners can view their bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT owner_id FROM public.businesses WHERE id = bookings.business_id)
);

-- Restore host read on vacation_bookings
CREATE POLICY "Hosts can view bookings for their properties"
ON public.vacation_bookings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.vacation_properties
    WHERE vacation_properties.id = vacation_bookings.property_id
      AND vacation_properties.host_id = auth.uid()
  )
);

-- Revoke column access to Stripe identifiers from signed-in users and anon
REVOKE SELECT (stripe_charge_id, payment_intent_id) ON public.bookings FROM authenticated, anon;
REVOKE SELECT (stripe_charge_id, payment_intent_id) ON public.vacation_bookings FROM authenticated, anon;

-- Drop the views we no longer need; code will read base tables again
DROP VIEW IF EXISTS public.business_owner_bookings;
DROP VIEW IF EXISTS public.host_vacation_bookings;
