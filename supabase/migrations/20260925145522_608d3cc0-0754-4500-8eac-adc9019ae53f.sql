CREATE OR REPLACE FUNCTION public._review_range_match(_name text, _range text)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE _range
    WHEN 'ah' THEN lower(left(coalesce(_name,''),1)) BETWEEN 'a' AND 'h'
    WHEN 'ip' THEN lower(left(coalesce(_name,''),1)) BETWEEN 'i' AND 'p'
    WHEN 'qz' THEN NOT (lower(left(coalesce(_name,''),1)) BETWEEN 'a' AND 'p' AND lower(left(coalesce(_name,''),1)) ~ '^[a-p]$')
    ELSE true END
$$;

CREATE OR REPLACE FUNCTION public.review_queue_leads(_status text, _range text DEFAULT 'all', _search text DEFAULT NULL, _limit int DEFAULT 50)
RETURNS SETOF json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
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
    AND public._review_range_match(l.business_name, _range)
    AND (_search IS NULL OR _search = '' OR l.business_name ILIKE '%' || _search || '%')
  ORDER BY l.created_at DESC
  LIMIT LEAST(coalesce(_limit,50), 200);
END $$;

CREATE OR REPLACE FUNCTION public.review_queue_counts(_range text DEFAULT 'all')
RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE r json;
BEGIN
  IF NOT public.can_review_businesses() THEN RAISE EXCEPTION 'Not authorized'; END IF;
  SELECT json_object_agg(s, c) INTO r FROM (
    SELECT verification_status s, count(*) c FROM public.b2b_external_leads
    WHERE verification_status IN ('needs_review','pending','promoted','rejected')
      AND public._review_range_match(business_name, _range)
    GROUP BY verification_status) x;
  RETURN coalesce(r, '{}'::json);
END $$;

REVOKE ALL ON FUNCTION public.review_queue_leads(text,text,text,int) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.review_queue_counts(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_queue_leads(text,text,text,int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.review_queue_counts(text) TO authenticated;