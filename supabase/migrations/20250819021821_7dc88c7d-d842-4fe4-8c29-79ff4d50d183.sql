-- Drop the insecure policy that allows everyone to view all business data
DROP POLICY IF EXISTS "Businesses are viewable by everyone" ON public.businesses;

-- Create policy for business owners to view their own complete data
CREATE POLICY "Business owners can view their own business" 
ON public.businesses 
FOR SELECT 
USING (auth.uid() = owner_id);

-- Create a secure function that provides public business data without sensitive contact info
CREATE OR REPLACE FUNCTION public.get_public_businesses()
RETURNS TABLE (
    id uuid,
    business_name text,
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
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
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

-- Grant access to all authenticated users for public business listings
GRANT EXECUTE ON FUNCTION public.get_public_businesses() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_businesses() TO anon;