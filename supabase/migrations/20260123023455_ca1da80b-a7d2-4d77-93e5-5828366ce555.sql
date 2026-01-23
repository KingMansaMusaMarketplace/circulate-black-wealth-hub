-- =============================================
-- SECURITY FIX: Protect sensitive data exposure
-- =============================================

-- 1. FIX: b2b_external_leads - Restrict public access to PII fields
-- Drop the policy we created that has the wrong column reference
DROP POLICY IF EXISTS "Users can view leads they discovered" ON public.b2b_external_leads;

-- Create secure policy: Only authenticated users can see leads they discovered
CREATE POLICY "Users can view leads they discovered"
  ON public.b2b_external_leads
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      discovered_by_user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.businesses b
        WHERE b.id = discovered_by_business_id
        AND b.owner_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid()
        AND p.user_type = 'admin'
      )
    )
  );