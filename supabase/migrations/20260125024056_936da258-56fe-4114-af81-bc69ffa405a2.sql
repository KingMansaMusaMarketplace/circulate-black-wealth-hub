
-- Drop the existing function first to avoid return type conflict
DROP FUNCTION IF EXISTS public.get_public_external_leads(integer);

-- Recreate with the correct signature
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
  data_quality_score integer,
  is_converted boolean,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
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
    AND is_converted = false
  ORDER BY data_quality_score DESC NULLS LAST, created_at DESC
  LIMIT p_limit;
$$;

-- Grant execute to authenticated users only
REVOKE ALL ON FUNCTION public.get_public_external_leads(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_external_leads(integer) TO authenticated;
