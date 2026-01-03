-- Drop and recreate the businesses_full_details view with SECURITY INVOKER
-- This ensures the view respects the RLS policies of the querying user, not the view creator

DROP VIEW IF EXISTS public.businesses_full_details;

CREATE VIEW public.businesses_full_details
WITH (security_invoker = true)
AS
SELECT 
    b.id,
    b.owner_id,
    b.business_name,
    b.description,
    b.category,
    b.address,
    b.city,
    b.state,
    b.zip_code,
    b.phone,
    b.email,
    b.website,
    b.logo_url,
    b.banner_url,
    b.is_verified,
    b.qr_code_id,
    b.qr_code_url,
    b.average_rating,
    b.review_count,
    b.created_at,
    b.updated_at,
    b.subscription_status,
    b.subscription_start_date,
    b.subscription_end_date,
    b.name,
    b.parent_business_id,
    b.location_type,
    b.location_name,
    b.location_manager_id,
    bp.phone AS owner_phone,
    bp.email AS owner_email,
    bp.owner_contact_notes
FROM businesses b
LEFT JOIN businesses_private bp ON b.id = bp.business_id;

-- Also ensure businesses_public_safe uses SECURITY INVOKER
DROP VIEW IF EXISTS public.businesses_public_safe;

CREATE VIEW public.businesses_public_safe
WITH (security_invoker = true)
AS
SELECT 
    id,
    business_name,
    description,
    category,
    address,
    city,
    state,
    zip_code,
    logo_url,
    banner_url,
    website,
    is_verified,
    average_rating,
    review_count,
    subscription_status,
    listing_status,
    created_at
FROM businesses
WHERE listing_status = 'active' OR listing_status IS NULL;

-- Grant appropriate permissions
GRANT SELECT ON public.businesses_public_safe TO anon, authenticated;
GRANT SELECT ON public.businesses_full_details TO authenticated;