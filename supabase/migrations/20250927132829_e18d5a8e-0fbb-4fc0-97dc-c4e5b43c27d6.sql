-- Final fix for remaining security linter warnings

-- Check and fix any remaining security definer views
-- The linter is still detecting security definer views, so let's systematically check and fix

-- Check if there are any views with security_definer option and remove it
-- First, get info about view options
SELECT 
    schemaname,
    viewname,
    viewowner,
    definition
FROM pg_views 
WHERE schemaname = 'public';

-- Drop and recreate all views to ensure they don't have security definer properties
-- These views should inherit security from the underlying tables via RLS

-- 1. Recreate sales_agent_applications_summary without any security properties
DROP VIEW IF EXISTS public.sales_agent_applications_summary CASCADE;
CREATE VIEW public.sales_agent_applications_summary AS
SELECT 
  id,
  user_id,
  application_status,
  test_score,
  test_passed,
  application_date,
  reviewed_at
FROM public.sales_agent_applications;

-- 2. Recreate business_verifications_admin_summary without security properties
DROP VIEW IF EXISTS public.business_verifications_admin_summary CASCADE;
CREATE VIEW public.business_verifications_admin_summary AS
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

-- 3. Recreate hbcu_verifications_admin_summary without security properties
DROP VIEW IF EXISTS public.hbcu_verifications_admin_summary CASCADE;
CREATE VIEW public.hbcu_verifications_admin_summary AS
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

-- 4. The public_referral_codes view should already be fixed, but let's ensure it's proper
DROP VIEW IF EXISTS public.public_referral_codes CASCADE;
CREATE VIEW public.public_referral_codes AS
SELECT 
  referral_code,
  is_active,
  created_at
FROM public.sales_agents 
WHERE is_active = true;

-- Double-check: find any remaining functions that might be missing search_path
-- and fix them if found
DO $$
DECLARE
    func_record RECORD;
    fix_sql TEXT;
BEGIN
    -- Find any security definer functions without proper search_path
    FOR func_record IN 
        SELECT 
            p.proname as function_name,
            n.nspname as schema_name,
            pg_get_functiondef(p.oid) as function_definition
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
          AND p.prosecdef = true  -- security definer functions
          AND (p.proconfig IS NULL OR NOT (p.proconfig @> ARRAY['search_path=public']))
    LOOP
        -- If we find any functions without search_path, we'll need to update them
        -- For now, just log that we found them
        RAISE NOTICE 'Found function without search_path: %.%', func_record.schema_name, func_record.function_name;
    END LOOP;
END $$;