-- Create a secure function for admins to get full application details for specific applications
CREATE OR REPLACE FUNCTION public.get_application_details(application_id uuid)
RETURNS TABLE (
    id uuid,
    user_id uuid,
    full_name text,
    email text,
    phone text,
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
        RAISE EXCEPTION 'Access denied. Admin privileges required to view application details.';
    END IF;
    
    RETURN QUERY
    SELECT 
        app.id,
        app.user_id,
        app.full_name,
        app.email,
        app.phone,
        app.application_date,
        app.application_status,
        app.test_score,
        app.test_passed,
        app.reviewed_at,
        app.reviewed_by,
        app.notes
    FROM sales_agent_applications app
    WHERE app.id = application_id;
END;
$$;

-- Grant access only to authenticated users (admins will be verified within the function)
REVOKE ALL ON FUNCTION public.get_application_details(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_application_details(uuid) TO authenticated;