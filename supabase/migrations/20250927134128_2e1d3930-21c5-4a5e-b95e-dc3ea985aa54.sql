-- Secure forum_categories table to require authentication
-- Remove the overly permissive policy that allows anonymous access
DROP POLICY IF EXISTS "Anyone can view forum categories" ON public.forum_categories;

-- Create a new policy that requires authentication to view forum categories
-- This prevents competitors from anonymously accessing business strategy information
CREATE POLICY "Authenticated users can view forum categories" 
ON public.forum_categories 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Optionally, we could also create a policy for admins to manage categories
-- but we'll keep it simple and secure for now
CREATE POLICY "Admins can manage forum categories" 
ON public.forum_categories 
FOR ALL 
USING (is_admin_secure()) 
WITH CHECK (is_admin_secure());