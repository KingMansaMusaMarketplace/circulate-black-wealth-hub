-- Fix RLS policies for public business directory views
-- These views currently have no RLS policies, making them completely open

-- Drop existing views to recreate with proper policies
DROP VIEW IF EXISTS public.business_directory_public CASCADE;
DROP VIEW IF EXISTS public.business_locations_view CASCADE;

-- Recreate business_directory_public view with only verified businesses
CREATE VIEW public.business_directory_public AS
SELECT 
  b.id,
  b.business_name,
  b.name,
  b.description,
  b.category,
  b.address,
  b.city,
  b.state,
  b.zip_code,
  b.website,
  b.logo_url,
  b.banner_url,
  b.is_verified,
  b.average_rating,
  b.review_count,
  b.location_type,
  b.location_name,
  b.parent_business_id,
  b.created_at
FROM businesses b
WHERE b.is_verified = true;

-- Add RLS policies for business_directory_public
ALTER VIEW public.business_directory_public SET (security_invoker = true);

-- Recreate business_locations_view with proper access control
CREATE VIEW public.business_locations_view AS
SELECT 
  b.id,
  b.business_name,
  b.location_name,
  b.city,
  b.state,
  b.location_type,
  b.parent_business_id,
  pb.business_name as parent_business_name,
  b.owner_id,
  b.location_manager_id,
  b.is_verified,
  b.created_at
FROM businesses b
LEFT JOIN businesses pb ON b.parent_business_id = pb.id
WHERE b.location_type = 'location';

-- Add RLS policies for business_locations_view
ALTER VIEW public.business_locations_view SET (security_invoker = true);

-- Update RLS policies to allow public read access to verified businesses only
CREATE POLICY "Public can view business directory"
  ON public.businesses
  FOR SELECT
  USING (is_verified = true);

-- Add comment explaining security
COMMENT ON VIEW public.business_directory_public IS 'Public view of verified businesses only - inherits RLS from businesses table';
COMMENT ON VIEW public.business_locations_view IS 'View of business locations - inherits RLS from businesses table';

-- Log security update
INSERT INTO public.security_audit_log (action, table_name, user_agent, timestamp)
VALUES ('rls_policies_updated', 'business_views', 'System: Fixed public view RLS policies', now());