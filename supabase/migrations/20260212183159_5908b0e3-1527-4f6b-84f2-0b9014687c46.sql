DROP VIEW IF EXISTS public.business_directory;

CREATE VIEW public.business_directory AS
SELECT id,
    business_name,
    name,
    description,
    category,
    address,
    city,
    state,
    zip_code,
    phone,
    email,
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
WHERE is_verified = true OR listing_status = 'live'::text;