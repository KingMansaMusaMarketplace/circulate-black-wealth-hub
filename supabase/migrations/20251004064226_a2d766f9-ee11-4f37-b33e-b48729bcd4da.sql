-- Fix infinite recursion in businesses table RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all business data" ON public.businesses;
DROP POLICY IF EXISTS "Business owners can access their complete business data" ON public.businesses;

-- Recreate policies using security definer functions to prevent recursion
CREATE POLICY "Admins can view all business data"
  ON public.businesses
  FOR ALL
  USING (public.is_admin_secure())
  WITH CHECK (public.is_admin_secure());

CREATE POLICY "Business owners can access their complete business data"
  ON public.businesses
  FOR ALL
  USING (
    auth.uid() = owner_id 
    OR auth.uid() = location_manager_id 
    OR auth.uid() IN (
      SELECT parent.owner_id
      FROM public.businesses parent
      WHERE parent.id = businesses.parent_business_id
    )
  )
  WITH CHECK (
    auth.uid() = owner_id 
    OR auth.uid() = location_manager_id 
    OR auth.uid() IN (
      SELECT parent.owner_id
      FROM public.businesses parent
      WHERE parent.id = businesses.parent_business_id
    )
  );