
-- Fix overly permissive INSERT policy on loyalty_engine_events
DROP POLICY IF EXISTS "System inserts loyalty events" ON public.loyalty_engine_events;

CREATE POLICY "Authenticated users log loyalty events" ON public.loyalty_engine_events
  FOR INSERT TO authenticated
  WITH CHECK (
    customer_id = auth.uid()
    OR business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
  );
