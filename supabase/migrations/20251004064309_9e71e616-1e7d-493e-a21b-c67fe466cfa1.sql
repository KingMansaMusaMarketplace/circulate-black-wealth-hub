-- Fix security definer view warning by enabling RLS on the view
-- This ensures the view respects RLS policies from underlying tables
ALTER VIEW public.business_locations_view SET (security_barrier = true);

-- Enable RLS on the view for added security
ALTER VIEW public.business_locations_view SET (security_invoker = true);