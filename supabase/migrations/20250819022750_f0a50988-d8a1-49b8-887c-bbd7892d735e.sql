-- First, ensure RLS is enabled on the sales_agent_applications table
ALTER TABLE public.sales_agent_applications ENABLE ROW LEVEL SECURITY;

-- Add comprehensive policies to secure job application data

-- Policy for admins to review applications (for legitimate hiring purposes)
CREATE POLICY "Admins can review sales agent applications" 
ON public.sales_agent_applications 
FOR SELECT 
USING (public.is_admin());

-- Policy for admins to update application status (approve/reject)
CREATE POLICY "Admins can update application status" 
ON public.sales_agent_applications 
FOR UPDATE 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Additional security: Create a secure function for admin application review that excludes sensitive details during initial screening
CREATE OR REPLACE FUNCTION public.get_applications_for_review()
RETURNS TABLE (
    id uuid,
    application_date timestamp with time zone,
    application_status text,
    test_score integer,
    test_passed boolean,
    reviewed_at timestamp with time zone,
    reviewed_by uuid,
    notes text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Only allow admins to access this function
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;
    
    RETURN QUERY
    SELECT 
        app.id,
        app.application_date,
        app.application_status,
        app.test_score,
        app.test_passed,
        app.reviewed_at,
        app.reviewed_by,
        app.notes
    FROM sales_agent_applications app
    ORDER BY app.application_date DESC;
END;
$$;

-- Grant access only to authenticated users (admins will be verified within the function)
REVOKE ALL ON FUNCTION public.get_applications_for_review() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_applications_for_review() TO authenticated;