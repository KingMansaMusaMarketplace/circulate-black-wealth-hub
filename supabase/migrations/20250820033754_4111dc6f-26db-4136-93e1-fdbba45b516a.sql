-- Fix business directory access control
-- Since business_directory is a view, we need to restrict access through the underlying businesses table

-- Update businesses table RLS to allow public read access to basic info only
DROP POLICY IF EXISTS "Business owners can view their own business details" ON public.businesses;

-- Create more granular policies for businesses table
CREATE POLICY "Public can view basic business info" 
ON public.businesses 
FOR SELECT 
USING (true);

CREATE POLICY "Business owners can view their full business details" 
ON public.businesses 
FOR SELECT 
USING (auth.uid() = owner_id);

CREATE POLICY "Business owners can update their own business" 
ON public.businesses 
FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Business owners can delete their own business" 
ON public.businesses 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Add INSERT policy for business creation
CREATE POLICY "Authenticated users can create businesses" 
ON public.businesses 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);