-- Create a secure view for public business listings that excludes contact info
CREATE OR REPLACE VIEW public.businesses_public_safe AS
SELECT 
  id,
  business_name,
  description,
  category,
  address,
  city,
  state,
  zip_code,
  logo_url,
  banner_url,
  website,
  is_verified,
  average_rating,
  review_count,
  subscription_status,
  listing_status,
  created_at
FROM public.businesses
WHERE listing_status = 'active' OR listing_status IS NULL;

-- Grant select on the safe view to public
GRANT SELECT ON public.businesses_public_safe TO anon, authenticated;

-- Create a function to check if user can view business contact info
CREATE OR REPLACE FUNCTION public.can_view_business_contact(business_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user is admin
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN true;
  END IF;
  
  -- Check if user is the business owner
  IF EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE id = business_id_param 
    AND (owner_id = auth.uid() OR location_manager_id = auth.uid())
  ) THEN
    RETURN true;
  END IF;
  
  -- For regular authenticated users, they can view contact info
  RETURN true;
END;
$$;

-- Add comments explaining the security model
COMMENT ON VIEW public.businesses_public_safe IS 'Public view of businesses that excludes sensitive contact information (email, phone). Use this view for anonymous/public queries.';
COMMENT ON FUNCTION public.can_view_business_contact IS 'Checks if the current user has permission to view business contact information.';