-- Fix PUBLIC_DATA_EXPOSURE: b2b_external_leads exposes PII publicly
-- Create a public view with only safe columns (no PII)

-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view visible external leads" ON public.b2b_external_leads;

-- Create a secure public view that excludes PII fields
CREATE OR REPLACE VIEW public.b2b_external_leads_public AS
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
FROM public.b2b_external_leads
WHERE is_visible_in_directory = true;

-- Grant access to the public view
GRANT SELECT ON public.b2b_external_leads_public TO anon, authenticated;

-- Create restricted policy: Only discoverers and admins can see full lead data
CREATE POLICY "Users can view leads they discovered"
ON public.b2b_external_leads FOR SELECT
USING (
  auth.uid() = discovered_by_user_id 
  OR auth.uid() = claimed_by_user_id
  OR public.is_admin_secure()
);

-- Add comment explaining the security design
COMMENT ON VIEW public.b2b_external_leads_public IS 'Public-safe view of external leads. Excludes PII fields (owner_email, phone_number, owner_name, contact_info). Full data accessible only to lead discoverers and admins.';