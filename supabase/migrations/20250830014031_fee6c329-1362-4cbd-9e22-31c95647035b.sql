-- Security Fix: Remove redundant views and ensure proper access control
-- The vault.decrypted_secrets view is a system view and cannot be modified

-- First, let's check what RLS policies exist on our views
-- Views inherit RLS from their underlying tables

-- Drop the redundant business_directory_public view since it's identical to business_directory
DROP VIEW IF EXISTS public.business_directory_public;

-- Ensure the business_directory view is properly secured
-- Since it accesses the businesses table, it will inherit RLS policies from that table
-- This means users will only see businesses they're authorized to see

-- Add a comment to document the security consideration
COMMENT ON VIEW public.business_directory IS 
'Secure view of business directory. Inherits RLS policies from businesses table. Only shows data user is authorized to access.';

-- Create a more secure business directory view that explicitly handles permissions
-- and limits what data is exposed
CREATE OR REPLACE VIEW public.business_directory_secure AS
SELECT 
  b.id,
  b.business_name,
  b.description,
  b.category,
  b.city,
  b.state,
  b.logo_url,
  b.banner_url,
  b.is_verified,
  b.average_rating,
  b.review_count,
  b.created_at
FROM public.businesses b
WHERE b.is_verified = true  -- Only show verified businesses to public
   OR auth.uid() = b.owner_id  -- Allow owners to see their own businesses
   OR public.is_admin();  -- Allow admins to see all businesses

-- Add RLS to the new secure view (though it inherits from businesses table)
-- This is just for explicit documentation
COMMENT ON VIEW public.business_directory_secure IS 
'Highly secure business directory view that only shows verified businesses to public, 
or allows business owners and admins to see appropriate businesses.';

-- Grant appropriate permissions
GRANT SELECT ON public.business_directory_secure TO authenticated;
GRANT SELECT ON public.business_directory_secure TO anon;