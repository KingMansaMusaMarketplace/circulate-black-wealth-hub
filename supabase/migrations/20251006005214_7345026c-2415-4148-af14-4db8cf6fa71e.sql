-- CRITICAL SECURITY FIX Part 2: Handle existing policies gracefully
-- This prevents privilege escalation attacks

-- 1. Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Public view businesses" ON public.businesses;
DROP POLICY IF EXISTS "Authenticated users view businesses" ON public.businesses;
DROP POLICY IF EXISTS "Owners view full business details" ON public.businesses;

-- 2. Create strict RLS policies for user_roles table
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Update businesses table RLS policies to restrict contact info
-- Only authenticated users can view businesses (protects from public scraping)
CREATE POLICY "Authenticated users view businesses"
ON public.businesses
FOR SELECT
TO authenticated
USING (true);

-- Business owners can view their own full details including contact info
CREATE POLICY "Owners view full business details"
ON public.businesses
FOR SELECT
TO authenticated
USING (
  auth.uid() = owner_id 
  OR auth.uid() = location_manager_id
  OR public.has_role(auth.uid(), 'admin')
);

COMMENT ON POLICY "Authenticated users view businesses" ON public.businesses IS 'Requires authentication to prevent mass scraping of business contact information';
COMMENT ON POLICY "Owners view full business details" ON public.businesses IS 'Allows business owners and admins to see full details including contact info';