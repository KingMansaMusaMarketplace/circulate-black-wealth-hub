-- Fix: Set businesses_public_safe view to SECURITY INVOKER
-- This ensures RLS policies of the querying user are enforced, not the view creator
ALTER VIEW public.businesses_public_safe SET (security_invoker = on);