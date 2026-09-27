CREATE OR REPLACE FUNCTION public.get_public_external_leads(p_limit integer DEFAULT 50)
 RETURNS TABLE(id uuid, business_name text, business_description text, category text, city text, state text, location text, website_url text, confidence_score numeric, data_quality_score integer, is_converted boolean, created_at timestamp with time zone)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT id, business_name, business_description, category, city, state, location, website_url,
         confidence_score, data_quality_score, is_converted, created_at
  FROM public.b2b_external_leads
  WHERE is_visible_in_directory = true
    AND is_converted = false
    AND coalesce(verification_status, '') <> 'rejected'
  ORDER BY data_quality_score DESC NULLS LAST, created_at DESC
  LIMIT p_limit;
$function$;
GRANT EXECUTE ON FUNCTION public.get_public_external_leads(integer) TO anon, authenticated;