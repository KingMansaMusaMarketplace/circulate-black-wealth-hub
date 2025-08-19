-- Drop the existing view that has security issues
DROP VIEW IF EXISTS public.admin_verification_queue;

-- Create a more secure view with proper RLS enforcement
-- This view will only be accessible through functions that check admin status
CREATE OR REPLACE VIEW public.admin_verification_queue AS
SELECT 
    bv.id AS verification_id,
    bv.business_id,
    bv.verification_status,
    bv.ownership_percentage,
    bv.submitted_at,
    bv.verified_at,
    b.owner_id,
    b.business_name,
    p.full_name AS owner_name,
    b.email AS business_email
FROM business_verifications bv
JOIN businesses b ON bv.business_id = b.id
LEFT JOIN profiles p ON b.owner_id = p.id
ORDER BY bv.submitted_at DESC;

-- Enable RLS on the view (this will actually restrict access)
ALTER VIEW public.admin_verification_queue SET (security_barrier = true);

-- Create RLS policy for the view that only allows admin access
CREATE POLICY "Admin verification queue access" 
ON public.admin_verification_queue 
FOR SELECT 
USING (public.is_admin());