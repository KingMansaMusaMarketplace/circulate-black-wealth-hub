CREATE OR REPLACE FUNCTION public.format_phone_display(p_phone text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN p_phone IS NULL OR btrim(p_phone) = '' THEN NULL
    WHEN length(regexp_replace(p_phone, '\D', '', 'g')) = 10
      THEN '(' || substr(regexp_replace(p_phone, '\D', '', 'g'),1,3) || ') '
           || substr(regexp_replace(p_phone, '\D', '', 'g'),4,3) || '-'
           || substr(regexp_replace(p_phone, '\D', '', 'g'),7,4)
    WHEN length(regexp_replace(p_phone, '\D', '', 'g')) = 11
         AND left(regexp_replace(p_phone, '\D', '', 'g'),1) = '1'
      THEN '(' || substr(regexp_replace(p_phone, '\D', '', 'g'),2,3) || ') '
           || substr(regexp_replace(p_phone, '\D', '', 'g'),5,3) || '-'
           || substr(regexp_replace(p_phone, '\D', '', 'g'),8,4)
    ELSE btrim(p_phone)
  END
$$;

GRANT EXECUTE ON FUNCTION public.format_phone_display(text) TO anon, authenticated, service_role;

DROP FUNCTION IF EXISTS public.search_directory_businesses(text,text,numeric,integer,integer,text,text,text,text);

CREATE FUNCTION public.search_directory_businesses(
  p_search_term text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_min_rating numeric DEFAULT NULL,
  p_limit integer DEFAULT 24,
  p_offset integer DEFAULT 0,
  p_category_group text DEFAULT NULL,
  p_country text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_city text DEFAULT NULL
)
RETURNS TABLE(id uuid, business_name text, name text, description text, category text, category_group text,
  address text, city text, state text, country text, zip_code text, website text, logo_url text, banner_url text,
  is_verified boolean, average_rating numeric, review_count integer, latitude double precision,
  longitude double precision, created_at timestamp with time zone, updated_at timestamp with time zone,
  listing_status text, is_founding_member boolean, is_founding_sponsor boolean, phone text, total_count bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
SET statement_timeout TO '20s'
AS $function$
DECLARE
  v_term text;
  v_pattern text;
  v_total bigint;
BEGIN
  v_term := nullif(btrim(coalesce(p_search_term, '')), '');
  v_pattern := CASE WHEN v_term IS NULL THEN NULL ELSE '%'||v_term||'%' END;

  SELECT count(*) INTO v_total
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_category_group IS NULL OR p_category_group = 'all' OR b.category_group = p_category_group)
    AND (p_country IS NULL OR p_country = 'all' OR b.country = p_country)
    AND (p_state IS NULL OR p_state = 'all' OR b.state = p_state)
    AND (p_city IS NULL OR p_city = 'all' OR b.city = p_city)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
    AND (
      v_pattern IS NULL
      OR b.business_name ILIKE v_pattern
      OR b.name          ILIKE v_pattern
      OR b.city          ILIKE v_pattern
      OR b.state         ILIKE v_pattern
      OR b.category      ILIKE v_pattern
      OR b.zip_code      ILIKE v_pattern
    );

  RETURN QUERY
  SELECT b.id,
         b.business_name::text, b.name::text, b.description::text, b.category::text, b.category_group::text,
         b.address::text, b.city::text, b.state::text, b.country::text, b.zip_code::text, b.website::text,
         b.logo_url::text, b.banner_url::text, b.is_verified, b.average_rating,
         b.review_count::int, b.latitude::double precision, b.longitude::double precision,
         b.created_at, b.updated_at, b.listing_status::text,
         b.is_founding_member, b.is_founding_sponsor,
         public.format_phone_display(coalesce(b.phone, bp.phone)),
         v_total
  FROM public.businesses b
  LEFT JOIN public.businesses_private bp ON bp.business_id = b.id
  WHERE b.listing_status = 'live'
    AND (p_category IS NULL OR p_category = 'all' OR b.category = p_category)
    AND (p_category_group IS NULL OR p_category_group = 'all' OR b.category_group = p_category_group)
    AND (p_country IS NULL OR p_country = 'all' OR b.country = p_country)
    AND (p_state IS NULL OR p_state = 'all' OR b.state = p_state)
    AND (p_city IS NULL OR p_city = 'all' OR b.city = p_city)
    AND (p_min_rating IS NULL OR p_min_rating = 0 OR b.average_rating >= p_min_rating)
    AND (
      v_pattern IS NULL
      OR b.business_name ILIKE v_pattern
      OR b.name          ILIKE v_pattern
      OR b.city          ILIKE v_pattern
      OR b.state         ILIKE v_pattern
      OR b.category      ILIKE v_pattern
      OR b.zip_code      ILIKE v_pattern
    )
  ORDER BY b.is_verified DESC,
           b.average_rating DESC NULLS LAST,
           b.created_at DESC
  LIMIT greatest(1, least(coalesce(p_limit, 24), 100))
  OFFSET greatest(0, coalesce(p_offset, 0));
END;
$function$;

GRANT EXECUTE ON FUNCTION public.search_directory_businesses(text,text,numeric,integer,integer,text,text,text,text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_directory_business_by_slug(p_slug text)
RETURNS TABLE(id uuid, slug text, business_name text, name text, description text, category text, address text, city text, state text, zip_code text, phone text, email text, website text, logo_url text, banner_url text, is_verified boolean, is_founding_sponsor boolean, average_rating numeric, review_count integer, location_type text, location_name text, latitude double precision, longitude double precision, listing_status text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT b.id, b.slug::text, b.business_name::text, b.name::text, b.description::text, b.category::text,
    b.address::text, b.city::text, b.state::text, b.zip_code::text,
    public.format_phone_display(coalesce(b.phone, bp.phone)), b.email::text,
    b.website::text, b.logo_url::text, b.banner_url::text, b.is_verified, b.is_founding_sponsor,
    b.average_rating, b.review_count, b.location_type::text, b.location_name::text,
    b.latitude::double precision, b.longitude::double precision, b.listing_status::text, b.created_at, b.updated_at
  FROM public.businesses b
  LEFT JOIN public.businesses_private bp ON bp.business_id = b.id
  WHERE b.slug = p_slug AND (b.is_verified = true OR b.listing_status = 'live') LIMIT 1;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_directory_business_by_id(p_business_id uuid)
RETURNS TABLE(id uuid, slug text, business_name text, name text, description text, category text, address text, city text, state text, zip_code text, phone text, email text, website text, logo_url text, banner_url text, is_verified boolean, is_founding_sponsor boolean, average_rating numeric, review_count integer, location_type text, location_name text, latitude double precision, longitude double precision, listing_status text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT b.id, b.slug::text, b.business_name::text, b.name::text, b.description::text, b.category::text,
    b.address::text, b.city::text, b.state::text, b.zip_code::text,
    public.format_phone_display(coalesce(b.phone, bp.phone)), b.email::text,
    b.website::text, b.logo_url::text, b.banner_url::text, b.is_verified, b.is_founding_sponsor,
    b.average_rating, b.review_count, b.location_type::text, b.location_name::text,
    b.latitude::double precision, b.longitude::double precision, b.listing_status::text, b.created_at, b.updated_at
  FROM public.businesses b
  LEFT JOIN public.businesses_private bp ON bp.business_id = b.id
  WHERE b.id = p_business_id AND (b.is_verified = true OR b.listing_status = 'live');
END;
$function$;

GRANT EXECUTE ON FUNCTION public.get_directory_business_by_slug(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_directory_business_by_id(uuid) TO anon, authenticated, service_role;