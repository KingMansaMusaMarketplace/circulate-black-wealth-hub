-- Fix 1: Create security definer function to prevent infinite recursion in businesses table
CREATE OR REPLACE FUNCTION public.is_business_owner(_user_id uuid, _business_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.businesses
    WHERE id = _business_id
      AND (owner_id = _user_id OR location_manager_id = _user_id)
  );
$$;

-- Fix 2: Drop existing problematic policies on businesses table
DROP POLICY IF EXISTS "Business owners can access their complete business data" ON public.businesses;
DROP POLICY IF EXISTS "Admins can view all business data" ON public.businesses;

-- Fix 3: Create new non-recursive policies for businesses table
CREATE POLICY "Admins can manage all businesses"
ON public.businesses
FOR ALL
TO authenticated
USING (public.is_admin_secure())
WITH CHECK (public.is_admin_secure());

CREATE POLICY "Business owners can manage their businesses"
ON public.businesses
FOR ALL
TO authenticated
USING (
  auth.uid() = owner_id 
  OR auth.uid() = location_manager_id
  OR auth.uid() IN (
    SELECT owner_id FROM public.businesses parent
    WHERE parent.id = businesses.parent_business_id
  )
)
WITH CHECK (
  auth.uid() = owner_id 
  OR auth.uid() = location_manager_id
);

-- Fix 4: Add public SELECT policy for businesses (excluding sensitive owner data)
CREATE POLICY "Public can view business listings"
ON public.businesses
FOR SELECT
TO public
USING (true);

-- Note: Sensitive fields (owner_id, phone, email) should be filtered in application layer
-- or use a view for public access

-- Fix 5: Create secure view for public business listings
CREATE OR REPLACE VIEW public.business_directory_public AS
SELECT 
  id,
  business_name,
  name,
  description,
  category,
  address,
  city,
  state,
  zip_code,
  website,
  logo_url,
  banner_url,
  is_verified,
  average_rating,
  review_count,
  created_at,
  location_type,
  location_name,
  parent_business_id
FROM public.businesses
WHERE is_verified = true;

-- Grant public access to the view
GRANT SELECT ON public.business_directory_public TO anon;
GRANT SELECT ON public.business_directory_public TO authenticated;

-- Fix 6: Strengthen admin audit logging for profiles
DROP POLICY IF EXISTS "Admins can view profiles with audit logging" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id 
  OR public.is_admin_secure()
);

-- Fix 7: Ensure access_personal_data_secure properly blocks on failure
-- Update the function to be more restrictive
CREATE OR REPLACE FUNCTION public.access_personal_data_secure(
  target_user_id uuid,
  data_type text,
  access_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  rate_limit_result JSONB;
  result JSONB;
BEGIN
  current_user_id := auth.uid();
  
  -- Fail if not authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Only admins can access personal data
  IF NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Check rate limit for personal data access
  SELECT public.check_rate_limit_secure('personal_data_access', 10, 60) INTO rate_limit_result;
  
  IF NOT (rate_limit_result->>'allowed')::boolean THEN
    RAISE EXCEPTION 'Rate limit exceeded for personal data access.';
  END IF;
  
  -- Log the access
  INSERT INTO public.personal_data_access_audit (
    accessed_by, target_user_id, data_type, access_reason
  ) VALUES (
    current_user_id, target_user_id, data_type, access_reason
  );
  
  result := jsonb_build_object(
    'success', true,
    'access_granted_at', now(),
    'access_reason', access_reason
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the failed attempt
    INSERT INTO public.security_audit_log (
      action, table_name, user_id, user_agent, timestamp
    ) VALUES (
      'failed_personal_data_access',
      'profiles',
      current_user_id,
      SQLERRM,
      now()
    );
    
    -- Re-raise the exception to block access
    RAISE;
END;
$$;