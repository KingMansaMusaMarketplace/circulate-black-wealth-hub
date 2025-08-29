-- Complete the security fix with remaining components
-- Only create what doesn't exist yet

-- Create a secure business directory view (if it doesn't exist)
CREATE OR REPLACE VIEW public.business_directory_public AS
SELECT 
  id,
  business_name,
  description,
  category,
  city,
  state,
  logo_url,
  banner_url,
  is_verified,
  average_rating,
  review_count,
  created_at
FROM public.businesses;

-- Add comments for documentation
COMMENT ON VIEW public.business_directory_public IS 'Secure public view of businesses excluding sensitive contact information (email, phone, address, website)';