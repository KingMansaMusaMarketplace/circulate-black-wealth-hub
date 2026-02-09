
-- Fix the b2b_external_leads SELECT policy that uses weak admin check via profiles.user_type
-- Replace it with is_admin_secure() to prevent privilege escalation

-- Drop the vulnerable policy
DROP POLICY IF EXISTS "Users can view leads they discovered" ON public.b2b_external_leads;

-- The simpler duplicate policy with same name might exist, let's also handle the complex one
-- First let's see what we have and recreate properly

-- Recreate a single clean SELECT policy for non-admin users
CREATE POLICY "Users can view leads they discovered"
ON public.b2b_external_leads
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    discovered_by_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM businesses b
      WHERE b.id = b2b_external_leads.discovered_by_business_id
      AND b.owner_id = auth.uid()
    )
  )
);
