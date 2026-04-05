-- Fix 1: business_interactions - restrict SELECT to own data + business owner
DROP POLICY IF EXISTS "Users can view all interactions" ON business_interactions;

CREATE POLICY "Users can view own interactions"
  ON business_interactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Business owners can view their business interactions"
  ON business_interactions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = business_interactions.business_id
        AND b.owner_id = auth.uid()
    )
  );

-- Fix 2: property_price_overrides - restrict SELECT to host only
DROP POLICY IF EXISTS "Authenticated users can view price overrides" ON property_price_overrides;