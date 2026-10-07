CREATE OR REPLACE FUNCTION public.get_mcp_category_counts(p_city text DEFAULT NULL, p_state text DEFAULT NULL, p_limit integer DEFAULT 30)
RETURNS TABLE(category text, business_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT initcap(trim(regexp_replace(b.category, '^\s*black[- ]owned\s+', '', 'i'))) AS category, count(*)::bigint
  FROM public.businesses b
  WHERE b.listing_status = 'live'
    AND coalesce(trim(b.category), '') <> ''
    AND (p_city IS NULL OR b.city ILIKE '%' || p_city || '%')
    AND (p_state IS NULL OR b.state ILIKE '%' || p_state || '%')
  GROUP BY 1
  ORDER BY 2 DESC
  LIMIT least(greatest(coalesce(p_limit, 30), 1), 60);
$$;
GRANT EXECUTE ON FUNCTION public.get_mcp_category_counts(text, text, integer) TO anon, authenticated;