CREATE OR REPLACE FUNCTION public.review_queue_counts(_range text DEFAULT 'all'::text)
 RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE r json;
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT json_object_agg(s, c) INTO r FROM (
    SELECT verification_status s, count(*) c FROM public.b2b_external_leads
    WHERE verification_status IN ('needs_review','pending','promoted','rejected')
      AND nullif(btrim(website_url),'') IS NOT NULL
      AND coalesce(website_status,'') <> 'not_found'
      AND public._review_range_match(business_name, _range)
    GROUP BY verification_status) x;
  RETURN coalesce(r, '{}'::json);
END $function$;

CREATE OR REPLACE FUNCTION public.review_queue_leads(_status text, _range text DEFAULT 'all'::text, _search text DEFAULT NULL::text, _limit integer DEFAULT 50)
 RETURNS SETOF json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  RETURN QUERY
  SELECT json_build_object('id',l.id,'business_name',l.business_name,'category',l.category,'city',l.city,'state',l.state,
    'website_url',l.website_url,'website_status',l.website_status,'phone_number',l.phone_number,'business_description',l.business_description,
    'logo_url',l.logo_url,'banner_url',l.banner_url,'confidence_score',l.confidence_score,'black_owned_confidence',l.black_owned_confidence,
    'black_owned_evidence',l.black_owned_evidence,'verification_status',l.verification_status,'verification_notes',l.verification_notes,
    'verified_phone',l.verified_phone,'verified_address',l.verified_address,'created_at',l.created_at)
  FROM public.b2b_external_leads l
  WHERE l.verification_status = _status
    AND nullif(btrim(l.website_url),'') IS NOT NULL
    AND coalesce(l.website_status,'') <> 'not_found'
    AND public._review_range_match(l.business_name, _range)
    AND (_search IS NULL OR _search = '' OR l.business_name ILIKE '%' || _search || '%')
  ORDER BY l.created_at DESC
  LIMIT LEAST(coalesce(_limit,50), 200);
END $function$;