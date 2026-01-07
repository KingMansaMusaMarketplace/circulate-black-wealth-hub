-- Fix Security Definer View: b2b_external_leads_public
-- This view currently bypasses RLS because security_invoker is false
-- We need to recreate it with security_invoker = true

DROP VIEW IF EXISTS public.b2b_external_leads_public;

CREATE VIEW public.b2b_external_leads_public
WITH (security_invoker = true)
AS
SELECT 
    id,
    business_name,
    business_description,
    category,
    city,
    state,
    zip_code,
    location,
    website_url,
    confidence_score,
    data_quality_score,
    is_converted,
    is_visible_in_directory,
    created_at
FROM b2b_external_leads
WHERE is_visible_in_directory = true;

-- Add comment explaining the view
COMMENT ON VIEW public.b2b_external_leads_public IS 'Public view of AI-discovered businesses that are visible in directory. Uses SECURITY INVOKER to respect RLS policies.';