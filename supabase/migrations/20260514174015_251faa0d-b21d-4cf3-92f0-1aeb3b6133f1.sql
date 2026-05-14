
CREATE OR REPLACE FUNCTION public.list_city_category_counts(
  p_categories text[],
  p_min_count integer DEFAULT 1
) RETURNS TABLE(city_slug text, category text, business_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    public.slugify(b.city || '-' || coalesce(b.state, '')) AS city_slug,
    b.category::text AS category,
    count(*)::bigint AS business_count
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND b.city IS NOT NULL AND b.city <> ''
    AND b.category = ANY(p_categories)
  GROUP BY public.slugify(b.city || '-' || coalesce(b.state, '')), b.category
  HAVING count(*) >= p_min_count;
$$;

GRANT EXECUTE ON FUNCTION public.list_city_category_counts(text[], integer) TO anon, authenticated;
