-- Ensure admins can view all businesses using the existing is_admin_secure function
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
CREATE POLICY "Admins can view all businesses" 
ON public.businesses 
FOR SELECT 
USING (public.is_admin_secure());