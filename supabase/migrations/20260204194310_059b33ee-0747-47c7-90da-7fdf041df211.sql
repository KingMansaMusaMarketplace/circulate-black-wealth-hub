-- Security Fix: Recreate business_directory view without sensitive contact information
-- and update sales_agent_applications_personal_data to use secure admin function

-- 1. Fix businesses_table_contact_exposure: Create secure business_directory view
-- Drop if exists and recreate with proper security
DROP VIEW IF EXISTS public.business_directory CASCADE;

CREATE VIEW public.business_directory 
WITH (security_invoker = true) AS 
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
  b.created_at,
  b.updated_at,
  b.latitude,
  b.longitude,
  b.listing_status,
  b.is_founding_member,
  b.is_founding_sponsor
  -- NOTE: Explicitly EXCLUDES email, phone, referral_code_used, owner_id and other sensitive fields
FROM businesses b
WHERE (b.is_verified = true OR b.listing_status = 'live');

-- Add comment explaining the security purpose
COMMENT ON VIEW public.business_directory IS 'Public-safe view of businesses that excludes sensitive contact information (email, phone). Used by anonymous/unauthenticated users to browse the directory.';

-- 2. Update businesses RLS policies to prevent direct access to email/phone for anonymous users
-- First, check and update the "Public can view live businesses" policy to be more restrictive
-- The view will be the primary access method for anonymous users

-- Drop the overly permissive policy that allows public access to all columns
DROP POLICY IF EXISTS "Public can view business listings" ON public.businesses;

-- Ensure the existing policies work correctly:
-- - Authenticated users can see public listings (existing policy)
-- - Owners/managers see full details (existing policy)  
-- - Admins have full access (existing policy)

-- 3. Fix sales_agent_applications_personal_pii: Update to use is_admin_secure()
DROP POLICY IF EXISTS "Only admins can access personal data with audit" ON public.sales_agent_applications_personal_data;
DROP POLICY IF EXISTS "Only admins can insert personal data" ON public.sales_agent_applications_personal_data;
DROP POLICY IF EXISTS "Only admins can update personal data with audit" ON public.sales_agent_applications_personal_data;

-- Recreate with is_admin_secure() for proper verification via user_roles table
CREATE POLICY "Only admins can access personal data with audit"
ON public.sales_agent_applications_personal_data
FOR SELECT
TO authenticated
USING (is_admin_secure() AND check_rate_limit('personal_data_access', 10));

CREATE POLICY "Only admins can insert personal data"
ON public.sales_agent_applications_personal_data
FOR INSERT
TO authenticated
WITH CHECK (is_admin_secure());

CREATE POLICY "Only admins can update personal data with audit"
ON public.sales_agent_applications_personal_data
FOR UPDATE
TO authenticated
USING (is_admin_secure())
WITH CHECK (is_admin_secure());

-- 4. Add audit logging trigger for personal data access
CREATE OR REPLACE FUNCTION public.log_personal_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the access to personal_data_access_audit table
  INSERT INTO public.personal_data_access_audit (
    admin_user_id,
    application_id,
    access_type,
    accessed_at
  ) VALUES (
    auth.uid(),
    NEW.id,
    TG_OP,
    now()
  );
  
  -- Update last_accessed fields on the record
  NEW.last_accessed_at := now();
  NEW.last_accessed_by := auth.uid();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Don't fail the query if audit logging fails
    RETURN NEW;
END;
$$;

-- Create audit trigger if it doesn't exist
DROP TRIGGER IF EXISTS audit_personal_data_access ON public.sales_agent_applications_personal_data;
CREATE TRIGGER audit_personal_data_access
  BEFORE UPDATE ON public.sales_agent_applications_personal_data
  FOR EACH ROW
  EXECUTE FUNCTION public.log_personal_data_access();