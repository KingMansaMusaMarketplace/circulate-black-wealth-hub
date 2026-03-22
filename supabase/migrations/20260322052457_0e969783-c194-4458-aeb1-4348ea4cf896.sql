
-- Fix the security definer view warning by explicitly setting SECURITY INVOKER
ALTER VIEW public.noir_drivers_public SET (security_invoker = on);
