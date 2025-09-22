-- Security enhancements for sales_agent_applications table

-- Add documentation comments to document PII protection
COMMENT ON TABLE public.sales_agent_applications IS 'Contains sensitive personal information protected by RLS policies. Access restricted to applicant and administrators only.';

-- Add comments to sensitive columns to document their protection  
COMMENT ON COLUMN public.sales_agent_applications.full_name IS 'PII - Protected by RLS, only accessible by applicant and admins';
COMMENT ON COLUMN public.sales_agent_applications.email IS 'PII - Protected by RLS, only accessible by applicant and admins';  
COMMENT ON COLUMN public.sales_agent_applications.phone IS 'PII - Protected by RLS, only accessible by applicant and admins';
COMMENT ON COLUMN public.sales_agent_applications.why_join IS 'PII - Contains personal information, protected by RLS';
COMMENT ON COLUMN public.sales_agent_applications.business_experience IS 'PII - Contains personal information, protected by RLS';
COMMENT ON COLUMN public.sales_agent_applications.marketing_ideas IS 'PII - Contains personal information, protected by RLS';

-- Verify the is_admin() function exists and works properly
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin' AND pronamespace = 'public'::regnamespace) THEN
        RAISE EXCEPTION 'is_admin() function not found - this could cause security issues';
    END IF;
END $$;

-- Verify RLS is enabled on the table
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

-- Create a secure view for minimal application data (non-sensitive fields only)
CREATE OR REPLACE VIEW public.sales_agent_applications_summary AS
SELECT 
    id,
    user_id,
    application_status,
    test_score,
    test_passed,
    application_date,
    reviewed_at
FROM public.sales_agent_applications;

-- Apply RLS to the view as well
ALTER VIEW public.sales_agent_applications_summary SET (security_invoker = on);

-- Add RLS policies to the view (same as the table)
CREATE POLICY "Users can view their own application summary" 
ON public.sales_agent_applications_summary 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all application summaries" 
ON public.sales_agent_applications_summary 
FOR SELECT 
USING (public.is_admin());