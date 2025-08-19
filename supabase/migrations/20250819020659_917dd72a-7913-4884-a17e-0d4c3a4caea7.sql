-- Enable Row Level Security on admin_verification_queue table
ALTER TABLE public.admin_verification_queue ENABLE ROW LEVEL SECURITY;

-- Create policy to only allow admins to view verification queue data
CREATE POLICY "Only admins can view verification queue" 
ON public.admin_verification_queue 
FOR SELECT 
USING (public.is_admin());

-- Create policy to only allow admins to insert verification queue data
CREATE POLICY "Only admins can insert verification queue data" 
ON public.admin_verification_queue 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Create policy to only allow admins to update verification queue data
CREATE POLICY "Only admins can update verification queue data" 
ON public.admin_verification_queue 
FOR UPDATE 
USING (public.is_admin());

-- Create policy to only allow admins to delete verification queue data
CREATE POLICY "Only admins can delete verification queue data" 
ON public.admin_verification_queue 
FOR DELETE 
USING (public.is_admin());