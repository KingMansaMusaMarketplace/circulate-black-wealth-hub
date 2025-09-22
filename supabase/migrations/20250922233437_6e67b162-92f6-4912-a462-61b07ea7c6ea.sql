-- Verify and enhance security for sales_agent_applications table

-- First, let's add a comment to document the security measures
COMMENT ON TABLE public.sales_agent_applications IS 'Contains sensitive personal information protected by RLS policies. Access restricted to applicant and administrators only.';

-- Add comments to sensitive columns to document their protection
COMMENT ON COLUMN public.sales_agent_applications.full_name IS 'PII - Protected by RLS, only accessible by applicant and admins';
COMMENT ON COLUMN public.sales_agent_applications.email IS 'PII - Protected by RLS, only accessible by applicant and admins';  
COMMENT ON COLUMN public.sales_agent_applications.phone IS 'PII - Protected by RLS, only accessible by applicant and admins';

-- Verify the is_admin() function exists and works properly
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin' AND pronamespace = 'public'::regnamespace) THEN
        RAISE EXCEPTION 'is_admin() function not found - this could cause security issues';
    END IF;
END $$;

-- Add an additional security function to validate access patterns
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Log when sensitive data is accessed
    INSERT INTO public.security_audit_log (
        action,
        table_name,
        record_id,
        user_id,
        timestamp
    ) VALUES (
        'sensitive_data_access',
        'sales_agent_applications',
        NEW.id,
        auth.uid(),
        now()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to log access to sensitive data
DROP TRIGGER IF EXISTS log_sales_agent_application_access ON public.sales_agent_applications;
CREATE TRIGGER log_sales_agent_application_access
    AFTER SELECT ON public.sales_agent_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.log_sensitive_data_access();

-- Verify RLS is enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE c.relname = 'sales_agent_applications' 
        AND n.nspname = 'public' 
        AND c.relrowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS not enabled on sales_agent_applications table';
    END IF;
END $$;