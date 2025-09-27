-- Drop and recreate the functions with secure return types
-- The previous function was returning sensitive PII data

-- Drop the unsafe function completely
DROP FUNCTION IF EXISTS public.get_public_sales_agents();

-- Create a new secure version that only returns safe data
CREATE FUNCTION public.get_public_referral_codes_only()
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
  -- Only return safe, non-PII data for public access
  SELECT 
    sa.referral_code,
    sa.is_active,
    sa.created_at
  FROM public.sales_agents sa
  WHERE sa.is_active = true;
  -- Explicitly NOT returning: id, user_id, full_name, email, phone (all PII)
$function$;

-- Drop and recreate get_agent_referral_codes with admin restriction
DROP FUNCTION IF EXISTS public.get_agent_referral_codes();

CREATE FUNCTION public.get_agent_referral_codes()
RETURNS TABLE(referral_code text, is_active boolean)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Restrict to admin access only 
  IF NOT is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    sa.referral_code,
    sa.is_active
  FROM sales_agents sa
  WHERE sa.is_active = true;
END;
$function$;