-- Update RLS policy to allow viewing businesses that are verified OR have listing_status = 'live'

-- Drop the existing policies for anonymous and authenticated users
DROP POLICY IF EXISTS "Anonymous can view verified businesses only" ON public.businesses;
DROP POLICY IF EXISTS "Authenticated users view verified businesses safely" ON public.businesses;

-- Create new policies that allow viewing verified OR live businesses
CREATE POLICY "Anonymous can view public businesses" 
ON public.businesses 
FOR SELECT 
TO anon
USING (is_verified = true OR listing_status = 'live');

CREATE POLICY "Authenticated users can view public businesses" 
ON public.businesses 
FOR SELECT 
TO authenticated
USING (is_verified = true OR listing_status = 'live');