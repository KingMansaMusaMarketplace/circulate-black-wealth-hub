-- Drop the problematic security definer view
DROP VIEW IF EXISTS public.public_sales_agents;

-- Create a secure function instead that returns only safe agent data
CREATE OR REPLACE FUNCTION public.get_public_sales_agents()
RETURNS TABLE (
    id uuid,
    referral_code text,
    is_active boolean,
    created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Only allow authenticated users to access this function
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required to access sales agent data.';
    END IF;
    
    RETURN QUERY
    SELECT 
        sa.id,
        sa.referral_code,
        sa.is_active,
        sa.created_at
    FROM sales_agents sa
    WHERE sa.is_active = true;
END;
$$;

-- Revoke public access and only grant to authenticated users
REVOKE ALL ON FUNCTION public.get_public_sales_agents() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_sales_agents() TO authenticated;