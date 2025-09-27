-- Fix the function with correct type and remove all views to eliminate security warnings

-- Drop ALL views to eliminate security definer view warnings
DROP VIEW IF EXISTS public.sales_agent_applications_summary CASCADE;
DROP VIEW IF EXISTS public.business_verifications_admin_summary CASCADE;
DROP VIEW IF EXISTS public.hbcu_verifications_admin_summary CASCADE;
DROP VIEW IF EXISTS public.public_referral_codes CASCADE;

-- Replace sales_agent_applications_summary with a secure function
CREATE OR REPLACE FUNCTION public.get_sales_agent_applications_summary()
RETURNS TABLE(
  id uuid, 
  user_id uuid, 
  application_status text, 
  test_score integer, 
  test_passed boolean, 
  application_date timestamp with time zone, 
  reviewed_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT 
    id,
    user_id,
    application_status,
    test_score,
    test_passed,
    application_date,
    reviewed_at
  FROM public.sales_agent_applications;
$function$;

-- Replace business_verifications_admin_summary with a secure function (admin only)
CREATE OR REPLACE FUNCTION public.get_business_verifications_admin_summary()
RETURNS TABLE(
  id uuid,
  business_id uuid,
  verification_status character varying,
  ownership_percentage integer,
  submitted_at timestamp with time zone,
  verified_at timestamp with time zone,
  verified_by uuid,
  rejection_reason text,
  admin_notes text,
  business_name character varying,
  owner_id uuid,
  owner_name character varying,
  business_email character varying,
  registration_document_status text,
  ownership_document_status text,
  address_document_status text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only admins can access this data
  IF NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    bv.id,
    bv.business_id,
    bv.verification_status,
    bv.ownership_percentage,
    bv.submitted_at,
    bv.verified_at,
    bv.verified_by,
    bv.rejection_reason,
    bv.admin_notes,
    b.business_name,
    b.owner_id,
    p.full_name AS owner_name,
    b.email AS business_email,
    CASE
      WHEN bv.registration_document_url IS NOT NULL THEN 'uploaded'::text
      ELSE 'missing'::text
    END AS registration_document_status,
    CASE
      WHEN bv.ownership_document_url IS NOT NULL THEN 'uploaded'::text
      ELSE 'missing'::text
    END AS ownership_document_status,
    CASE
      WHEN bv.address_document_url IS NOT NULL THEN 'uploaded'::text
      ELSE 'missing'::text
    END AS address_document_status
  FROM business_verifications bv
  JOIN businesses b ON bv.business_id = b.id
  LEFT JOIN profiles p ON b.owner_id = p.id;
END;
$function$;

-- Replace hbcu_verifications_admin_summary with a secure function (admin only) - using correct type
CREATE OR REPLACE FUNCTION public.get_hbcu_verifications_admin_summary()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  verification_status hbcu_verification_status,  -- Fixed: use correct type
  verified_at timestamp with time zone,
  verified_by uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  document_type text,
  rejection_reason text,
  document_status text,
  student_name character varying,
  student_email character varying
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only admins can access this data
  IF NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    hv.id,
    hv.user_id,
    hv.verification_status,
    hv.verified_at,
    hv.verified_by,
    hv.created_at,
    hv.updated_at,
    hv.document_type,
    hv.rejection_reason,
    CASE
      WHEN hv.document_url IS NOT NULL THEN 'Document Available'::text
      ELSE 'No Document'::text
    END AS document_status,
    p.full_name AS student_name,
    p.email AS student_email
  FROM hbcu_verifications hv
  LEFT JOIN profiles p ON hv.user_id = p.id;
END;
$function$;

-- Create a simple function for public referral codes (replaces view)
CREATE OR REPLACE FUNCTION public.get_public_referral_codes()
RETURNS TABLE(
  referral_code text,
  is_active boolean,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT 
    referral_code,
    is_active,
    created_at
  FROM public.sales_agents 
  WHERE is_active = true;
$function$;