-- Drop the existing insecure view
DROP VIEW IF EXISTS public.admin_verification_queue;

-- Create a secure function that only admins can call to get verification queue data
CREATE OR REPLACE FUNCTION public.get_admin_verification_queue()
RETURNS TABLE (
    verification_id uuid,
    business_id uuid,
    verification_status character varying,
    ownership_percentage integer,
    submitted_at timestamp with time zone,
    verified_at timestamp with time zone,
    owner_id uuid,
    business_name character varying,
    owner_name character varying,
    business_email character varying
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
        bv.id AS verification_id,
        bv.business_id,
        bv.verification_status,
        bv.ownership_percentage,
        bv.submitted_at,
        bv.verified_at,
        b.owner_id,
        b.business_name,
        p.full_name AS owner_name,
        b.email AS business_email
    FROM business_verifications bv
    JOIN businesses b ON bv.business_id = b.id
    LEFT JOIN profiles p ON b.owner_id = p.id
    ORDER BY bv.submitted_at DESC;
END;
$$;

-- Revoke public access and only grant to authenticated users
REVOKE ALL ON FUNCTION public.get_admin_verification_queue() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_verification_queue() TO authenticated;