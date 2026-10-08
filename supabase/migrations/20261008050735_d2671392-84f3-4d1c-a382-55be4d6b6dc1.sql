CREATE OR REPLACE FUNCTION public.get_ally_businesses(p_search text DEFAULT NULL::text, p_limit integer DEFAULT 60, p_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, name text, category text, city text, state text, website text, phone text, logo_url text, description text)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT b.id, COALESCE(b.business_name, b.name), b.category, b.city, b.state, b.website,
         COALESCE(b.phone, bp.phone), b.logo_url, b.description
  FROM public.businesses b
  LEFT JOIN public.businesses_private bp ON bp.business_id = b.id
  WHERE b.listing_type = 'ally' AND b.listing_status = 'ally_live'
    AND (p_search IS NULL OR p_search = '' OR COALESCE(b.business_name, b.name) ILIKE '%' || p_search || '%' OR b.city ILIKE '%' || p_search || '%' OR b.category ILIKE '%' || p_search || '%')
  ORDER BY COALESCE(b.business_name, b.name)
  LIMIT LEAST(GREATEST(p_limit, 1), 100) OFFSET GREATEST(p_offset, 0);
$function$;
GRANT EXECUTE ON FUNCTION public.get_ally_businesses(text, integer, integer) TO anon, authenticated;