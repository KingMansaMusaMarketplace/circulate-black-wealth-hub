
-- Landing page RPCs for /black-owned/city/:slug and /black-owned/category/:slug

CREATE OR REPLACE FUNCTION public.list_landing_cities(p_min_count integer DEFAULT 5)
RETURNS TABLE(city text, state text, slug text, business_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    b.city::text AS city,
    b.state::text AS state,
    public.slugify(b.city || '-' || coalesce(b.state, '')) AS slug,
    count(*)::bigint AS business_count
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND b.city IS NOT NULL AND b.city <> ''
  GROUP BY b.city, b.state
  HAVING count(*) >= p_min_count
  ORDER BY count(*) DESC;
$$;

CREATE OR REPLACE FUNCTION public.list_landing_categories(p_min_count integer DEFAULT 5)
RETURNS TABLE(category text, slug text, business_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    b.category::text AS category,
    public.slugify(b.category) AS slug,
    count(*)::bigint AS business_count
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND b.category IS NOT NULL AND b.category <> ''
  GROUP BY b.category
  HAVING count(*) >= p_min_count
  ORDER BY count(*) DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_businesses_by_city_slug(
  p_slug text, p_limit integer DEFAULT 60, p_offset integer DEFAULT 0
) RETURNS TABLE(
  id uuid, slug text, business_name text, name text, description text, category text,
  address text, city text, state text, phone text, website text, logo_url text, banner_url text,
  is_verified boolean, average_rating numeric, review_count integer, total_count bigint
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_total bigint;
BEGIN
  SELECT count(*) INTO v_total
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND public.slugify(b.city || '-' || coalesce(b.state, '')) = p_slug;

  RETURN QUERY
  SELECT b.id, b.slug::text, b.business_name::text, b.name::text, b.description::text, b.category::text,
    b.address::text, b.city::text, b.state::text, b.phone::text, b.website::text,
    b.logo_url::text, b.banner_url::text, b.is_verified, b.average_rating, b.review_count, v_total
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND public.slugify(b.city || '-' || coalesce(b.state, '')) = p_slug
  ORDER BY b.is_verified DESC NULLS LAST, b.average_rating DESC NULLS LAST, b.review_count DESC NULLS LAST
  LIMIT p_limit OFFSET p_offset;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_businesses_by_category_slug(
  p_slug text, p_limit integer DEFAULT 60, p_offset integer DEFAULT 0
) RETURNS TABLE(
  id uuid, slug text, business_name text, name text, description text, category text,
  address text, city text, state text, phone text, website text, logo_url text, banner_url text,
  is_verified boolean, average_rating numeric, review_count integer, total_count bigint
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_total bigint;
BEGIN
  SELECT count(*) INTO v_total
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND public.slugify(b.category) = p_slug;

  RETURN QUERY
  SELECT b.id, b.slug::text, b.business_name::text, b.name::text, b.description::text, b.category::text,
    b.address::text, b.city::text, b.state::text, b.phone::text, b.website::text,
    b.logo_url::text, b.banner_url::text, b.is_verified, b.average_rating, b.review_count, v_total
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND public.slugify(b.category) = p_slug
  ORDER BY b.is_verified DESC NULLS LAST, b.average_rating DESC NULLS LAST, b.review_count DESC NULLS LAST
  LIMIT p_limit OFFSET p_offset;
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_landing_cities(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_landing_categories(integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_businesses_by_city_slug(text, integer, integer) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_businesses_by_category_slug(text, integer, integer) TO anon, authenticated;
