
-- Drop and recreate the view (can't use CREATE OR REPLACE to remove columns)
DROP VIEW IF EXISTS public.business_directory;

CREATE VIEW public.business_directory AS
SELECT 
    id,
    business_name,
    name,
    description,
    category,
    address,
    city,
    state,
    zip_code,
    website,
    logo_url,
    banner_url,
    is_verified,
    average_rating,
    review_count,
    created_at,
    updated_at,
    latitude,
    longitude,
    listing_status,
    is_founding_member,
    is_founding_sponsor
FROM businesses
WHERE (is_verified = true) OR (listing_status = 'live'::text);

-- Create a secure RPC for fetching a single public business by ID (no PII)
CREATE OR REPLACE FUNCTION public.get_public_business_by_id(p_business_id uuid)
RETURNS TABLE (
    id uuid,
    business_name text,
    name text,
    description text,
    category text,
    address text,
    city text,
    state text,
    zip_code text,
    website text,
    logo_url text,
    banner_url text,
    is_verified boolean,
    average_rating numeric,
    review_count integer,
    created_at timestamptz,
    updated_at timestamptz,
    latitude double precision,
    longitude double precision,
    listing_status text,
    is_founding_member boolean,
    is_founding_sponsor boolean,
    owner_id uuid
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        b.id, b.business_name, b.name, b.description, b.category,
        b.address, b.city, b.state, b.zip_code, b.website,
        b.logo_url, b.banner_url, b.is_verified, b.average_rating,
        b.review_count, b.created_at, b.updated_at,
        b.latitude, b.longitude, b.listing_status,
        b.is_founding_member, b.is_founding_sponsor, b.owner_id
    FROM public.businesses b
    WHERE b.id = p_business_id
      AND (b.is_verified = true OR b.listing_status = 'live'::text);
$$;
