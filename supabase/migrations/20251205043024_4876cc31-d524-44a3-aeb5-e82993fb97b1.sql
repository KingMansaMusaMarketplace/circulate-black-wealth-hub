-- Drop the problematic policy
DROP POLICY IF EXISTS "Owners manage businesses" ON public.businesses;

-- Create a SECURITY DEFINER function to safely check parent business ownership
CREATE OR REPLACE FUNCTION public.is_business_owner_or_manager(business_owner_id uuid, business_location_manager_id uuid, business_parent_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT 
    auth.uid() = business_owner_id 
    OR auth.uid() = business_location_manager_id
    OR (
      business_parent_id IS NOT NULL 
      AND EXISTS (
        SELECT 1 FROM businesses parent 
        WHERE parent.id = business_parent_id 
        AND parent.owner_id = auth.uid()
      )
    )
$$;

-- Recreate the policy using the safe function
CREATE POLICY "Owners manage businesses" ON public.businesses
FOR ALL
TO authenticated
USING (
  is_business_owner_or_manager(owner_id, location_manager_id, parent_business_id)
)
WITH CHECK (
  auth.uid() = owner_id OR auth.uid() = location_manager_id
);