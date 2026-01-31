-- Fix platform_transactions RLS policy to use secure admin verification
-- The current policy uses is_admin() which checks profiles.user_type (insecure)
-- Replace with is_admin_secure() which uses the proper user_roles table

-- Drop the insecure admin policy
DROP POLICY IF EXISTS "Admins can view all platform transactions" ON public.platform_transactions;

-- Create new secure admin policy using is_admin_secure()
CREATE POLICY "Admins can view all platform transactions secure" 
ON public.platform_transactions 
FOR SELECT 
TO authenticated
USING (is_admin_secure());