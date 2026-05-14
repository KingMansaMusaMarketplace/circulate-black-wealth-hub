
CREATE OR REPLACE FUNCTION public.get_businesses_by_city_and_categories(
  p_city_slug text,
  p_categories text[],
  p_limit integer DEFAULT 60,
  p_offset integer DEFAULT 0
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
    AND public.slugify(b.city || '-' || coalesce(b.state, '')) = p_city_slug
    AND b.category = ANY(p_categories);

  RETURN QUERY
  SELECT b.id, b.slug::text, b.business_name::text, b.name::text, b.description::text, b.category::text,
    b.address::text, b.city::text, b.state::text, b.phone::text, b.website::text,
    b.logo_url::text, b.banner_url::text, b.is_verified, b.average_rating, b.review_count, v_total
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND public.slugify(b.city || '-' || coalesce(b.state, '')) = p_city_slug
    AND b.category = ANY(p_categories)
  ORDER BY b.is_verified DESC NULLS LAST, b.average_rating DESC NULLS LAST, b.review_count DESC NULLS LAST
  LIMIT p_limit OFFSET p_offset;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_businesses_by_city_and_categories(text, text[], integer, integer) TO anon, authenticated;
