-- Fix the function recreation issue by dropping them first

-- Drop functions that need to be recreated with different signatures
DROP FUNCTION IF EXISTS public.get_public_businesses();
DROP FUNCTION IF EXISTS public.get_public_sales_agents();
DROP FUNCTION IF EXISTS public.get_agent_referral_codes();
DROP FUNCTION IF EXISTS public.get_active_referral_codes();

-- Drop the business_directory view completely (if it still exists)
DROP VIEW IF EXISTS public.business_directory;

-- Recreate get_public_businesses function without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_public_businesses()
RETURNS TABLE(
  id uuid,
  business_name character varying,
  description text,
  category character varying,
  address character varying,
  city character varying,
  state character varying,
  zip_code character varying,
  website character varying,
  logo_url character varying,
  banner_url character varying,
  is_verified boolean,
  average_rating numeric,
  review_count integer,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
    -- This function now relies on RLS policies instead of SECURITY DEFINER
    -- Only businesses the user has access to will be returned
    RETURN QUERY
    SELECT 
        b.id,
        b.business_name,
        b.description,
        b.category,
        b.address,
        b.city,
        b.state,
        b.zip_code,
        b.website,
        b.logo_url,
        b.banner_url,
        b.is_verified,
        b.average_rating,
        b.review_count,
        b.created_at
    FROM businesses b
    ORDER BY b.business_name;
END;
$$;

-- Recreate get_public_sales_agents function without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_public_sales_agents()
RETURNS TABLE(
  id uuid,
  referral_code text,
  is_active boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
    -- This function now relies on RLS policies instead of SECURITY DEFINER
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

-- Recreate get_agent_referral_codes function without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_agent_referral_codes()
RETURNS TABLE(
  id uuid,
  referral_code text,
  is_active boolean
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
    -- This function now relies on RLS policies instead of SECURITY DEFINER
    RETURN QUERY
    SELECT 
        sa.id,
        sa.referral_code,
        sa.is_active
    FROM sales_agents sa
    WHERE sa.is_active = true;
END;
$$;

-- Recreate get_active_referral_codes function without SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_active_referral_codes()
RETURNS TABLE(
  referral_code text,
  is_active boolean
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
    -- This function now relies on RLS policies instead of SECURITY DEFINER
    RETURN QUERY
    SELECT 
        sa.referral_code,
        sa.is_active
    FROM sales_agents sa
    WHERE sa.is_active = true;
END;
$$;