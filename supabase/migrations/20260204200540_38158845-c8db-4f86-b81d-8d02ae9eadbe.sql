-- Fix: Require authentication to access marketing materials
-- This addresses the marketing_materials_unrestricted_access warning

-- Drop any existing public access policies
DROP POLICY IF EXISTS "Public can view marketing materials" ON public.marketing_materials;
DROP POLICY IF EXISTS "Anyone can view marketing materials" ON public.marketing_materials;
DROP POLICY IF EXISTS "Authenticated users can view marketing materials" ON public.marketing_materials;

-- Create policy requiring authentication to view active materials
CREATE POLICY "Authenticated users can view marketing materials"
ON public.marketing_materials
FOR SELECT
TO authenticated
USING (is_active = true);

-- Ensure admins can manage all materials using has_role function
CREATE POLICY "Admins can manage marketing materials"
ON public.marketing_materials
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));