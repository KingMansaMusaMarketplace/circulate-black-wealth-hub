
-- ============================================
-- 1. BUSINESSES: Prevent location managers from changing owner_id
-- ============================================
CREATE OR REPLACE FUNCTION public.protect_business_ownership()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can change owner_id
  IF NEW.owner_id IS DISTINCT FROM OLD.owner_id THEN
    IF NOT is_admin_secure() THEN
      -- Only the current owner can transfer ownership
      IF OLD.owner_id != auth.uid() THEN
        RAISE EXCEPTION 'Only the business owner or an admin can transfer ownership';
      END IF;
    END IF;
  END IF;
  
  -- Location managers cannot change location_manager_id either
  IF NEW.location_manager_id IS DISTINCT FROM OLD.location_manager_id THEN
    IF NOT is_admin_secure() AND auth.uid() != OLD.owner_id THEN
      RAISE EXCEPTION 'Only the business owner or an admin can change the location manager';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_business_ownership_trigger ON public.businesses;
CREATE TRIGGER protect_business_ownership_trigger
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_business_ownership();

-- ============================================
-- 2. B2B_EXTERNAL_LEADS: Revoke column access to sensitive tokens
-- ============================================
-- First revoke all SELECT on the table for authenticated/anon
REVOKE SELECT ON public.b2b_external_leads FROM authenticated;
REVOKE SELECT ON public.b2b_external_leads FROM anon;

-- Re-grant SELECT on all columns EXCEPT sensitive tokens
DO $$
DECLARE
  col_name text;
  excluded_cols text[] := ARRAY['claim_token', 'invitation_token', 'claim_token_expires_at'];
BEGIN
  FOR col_name IN
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'b2b_external_leads'
  LOOP
    IF NOT (col_name = ANY(excluded_cols)) THEN
      EXECUTE format('GRANT SELECT(%I) ON public.b2b_external_leads TO authenticated', col_name);
    END IF;
  END LOOP;
END $$;
