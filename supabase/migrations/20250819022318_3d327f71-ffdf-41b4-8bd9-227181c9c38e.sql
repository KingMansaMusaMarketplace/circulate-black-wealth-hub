-- Drop the current policy that still exposes too much data
DROP POLICY IF EXISTS "Public can view active agent referral codes only" ON public.sales_agents;

-- Create a more secure function that only returns absolutely necessary referral data
CREATE OR REPLACE FUNCTION public.get_agent_referral_codes()
RETURNS TABLE (
    id uuid,
    referral_code text,
    is_active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Only return minimal data needed for referral functionality
    RETURN QUERY
    SELECT 
        sa.id,
        sa.referral_code,
        sa.is_active
    FROM sales_agents sa
    WHERE sa.is_active = true;
END;
$$;

-- Grant access to the secure function (no authentication required for referral lookups)
GRANT EXECUTE ON FUNCTION public.get_agent_referral_codes() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_agent_referral_codes() TO anon;