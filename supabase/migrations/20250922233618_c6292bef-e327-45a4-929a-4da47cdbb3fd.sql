-- Fix security definer view warning by recreating the view properly

-- Drop the existing view
DROP VIEW IF EXISTS public.sales_agent_applications_summary;

-- Recreate the view as a simple security invoker view (default)
-- This ensures it uses the permissions of the querying user, not the creator
CREATE VIEW public.sales_agent_applications_summary AS
SELECT 
    id,
    user_id,
    application_status,
    test_score,
    test_passed,
    application_date,
    reviewed_at
FROM public.sales_agent_applications;

-- Ensure the view uses security invoker (not definer) - this is the default but let's be explicit
ALTER VIEW public.sales_agent_applications_summary SET (security_invoker = true);

-- Add comment explaining the security model
COMMENT ON VIEW public.sales_agent_applications_summary IS 'Non-sensitive summary of sales agent applications. Uses SECURITY INVOKER to ensure proper RLS enforcement for each user.';