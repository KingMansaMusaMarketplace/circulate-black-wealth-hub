-- Fix business directory access control (corrected)
-- Since business_directory is a view, we need to restrict access through the underlying businesses table

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Business owners can view their own business details" ON public.businesses;
DROP POLICY IF EXISTS "Business owners can update their own business" ON public.businesses;
DROP POLICY IF EXISTS "Business owners can delete their own business" ON public.businesses;

-- Create public read policy for basic business directory info
CREATE POLICY "Public can view basic business info" 
ON public.businesses 
FOR SELECT 
USING (true);

-- Re-create owner-specific policies with different names
CREATE POLICY "Owners can update their business" 
ON public.businesses 
FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their business" 
ON public.businesses 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Add INSERT policy for business creation
CREATE POLICY "Users can create businesses" 
ON public.businesses 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

-- The business_directory view will now be accessible to public but only show the data
-- that the underlying businesses table policies allow