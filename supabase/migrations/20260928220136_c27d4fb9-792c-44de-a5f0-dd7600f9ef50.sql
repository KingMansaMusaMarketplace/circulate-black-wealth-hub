CREATE OR REPLACE FUNCTION public._review_range_match(_name text, _range text)
 RETURNS boolean LANGUAGE sql IMMUTABLE
AS $function$
  SELECT CASE _range
    WHEN 'ah' THEN pg_catalog.lower(pg_catalog.left(coalesce(_name,''),1)) BETWEEN 'a' AND 'h'
    WHEN 'ip' THEN pg_catalog.lower(pg_catalog.left(coalesce(_name,''),1)) BETWEEN 'i' AND 'p'
    WHEN 'qz' THEN NOT (pg_catalog.lower(pg_catalog.left(coalesce(_name,''),1)) ~ '^[a-p]$')
    ELSE true END
$function$;
CREATE INDEX IF NOT EXISTS idx_b2b_leads_status_created ON public.b2b_external_leads (verification_status, created_at DESC);