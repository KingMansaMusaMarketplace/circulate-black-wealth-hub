-- Fix: Restrict property_price_overrides SELECT from public to authenticated
-- and create a safe view that excludes the internal 'reason' column

-- Drop the overly permissive public SELECT policy
DROP POLICY "Anyone can view price overrides" ON property_price_overrides;

-- Create a restricted SELECT policy for authenticated users only
CREATE POLICY "Authenticated users can view price overrides"
  ON property_price_overrides FOR SELECT
  TO authenticated
  USING (true);

-- Create a public-safe view excluding the 'reason' column for booking flows
CREATE OR REPLACE VIEW public.property_price_overrides_public
WITH (security_invoker = on) AS
  SELECT id, property_id, date, price_per_night, created_at
  FROM public.property_price_overrides;
