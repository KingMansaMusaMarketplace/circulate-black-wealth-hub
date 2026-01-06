-- Create RPC function to safely return public lead data without PII
CREATE OR REPLACE FUNCTION public.get_public_external_leads(p_limit integer DEFAULT 50)
RETURNS TABLE (
  id uuid,
  business_name text,
  business_description text,
  category text,
  city text,
  state text,
  location text,
  website_url text,
  confidence_score numeric,
  data_quality_score numeric,
  is_converted boolean,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    id,
    business_name,
    business_description,
    category,
    city,
    state,
    location,
    website_url,
    confidence_score,
    data_quality_score,
    is_converted,
    created_at
  FROM public.b2b_external_leads
  WHERE is_visible_in_directory = true
  ORDER BY created_at DESC
  LIMIT p_limit;
$$;

-- Grant execute to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_public_external_leads TO authenticated, anon;

-- Add comment
COMMENT ON FUNCTION public.get_public_external_leads IS 'Returns public-safe external lead data for directory display. Excludes PII fields (owner_email, phone_number, owner_name, contact_info).';