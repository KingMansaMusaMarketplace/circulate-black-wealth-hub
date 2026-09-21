CREATE OR REPLACE FUNCTION public.normalize_state_code(p_state text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $$
  SELECT CASE
    WHEN s IS NULL OR s = '' OR lower(s) IN ('unknown','not specified','not applicable','not publicly available','n/a','none') THEN NULL
    ELSE coalesce(
      (SELECT code FROM (VALUES
        ('alabama','AL'),('alaska','AK'),('arizona','AZ'),('arkansas','AR'),('california','CA'),
        ('colorado','CO'),('connecticut','CT'),('delaware','DE'),('florida','FL'),('georgia','GA'),
        ('hawaii','HI'),('idaho','ID'),('illinois','IL'),('indiana','IN'),('iowa','IA'),
        ('kansas','KS'),('kentucky','KY'),('louisiana','LA'),('maine','ME'),('maryland','MD'),
        ('massachusetts','MA'),('michigan','MI'),('minnesota','MN'),('mississippi','MS'),('missouri','MO'),
        ('montana','MT'),('nebraska','NE'),('nevada','NV'),('new hampshire','NH'),('new jersey','NJ'),
        ('new mexico','NM'),('new york','NY'),('north carolina','NC'),('north dakota','ND'),('ohio','OH'),
        ('oklahoma','OK'),('oregon','OR'),('pennsylvania','PA'),('rhode island','RI'),('south carolina','SC'),
        ('south dakota','SD'),('tennessee','TN'),('texas','TX'),('utah','UT'),('vermont','VT'),
        ('virginia','VA'),('washington','WA'),('west virginia','WV'),('wisconsin','WI'),('wyoming','WY'),
        ('district of columbia','DC'),('washington dc','DC'),('washington d.c.','DC'),('d.c.','DC'),
        ('puerto rico','PR'),('virgin islands','VI'),('u.s. virgin islands','VI'),('us virgin islands','VI'),
        ('guam','GU'),('american samoa','AS'),('northern mariana islands','MP'),
        ('ontario','ON'),('quebec','QC'),('british columbia','BC'),('alberta','AB'),('manitoba','MB'),
        ('nova scotia','NS'),('saskatchewan','SK'),('new brunswick','NB'),
        ('newfoundland and labrador','NL'),('prince edward island','PE'),
        ('england','ENG'),('scotland','SCT'),('wales','WLS'),('jamaica','JM'),('belize','BZ'),
        ('ghana','GH'),('nigeria','NG'),('bahamas','BS'),('barbados','BB'),('haiti','HT'),
        ('ohio ','OH')
      ) AS m(nm, code) WHERE m.nm = lower(s)),
      upper(s)
    )
  END
  FROM (SELECT btrim(coalesce(p_state, '')) AS s) t;
$$;

-- Repair rows garbled by the previous four-letter shortcut
UPDATE public.businesses b
SET state = v.code
FROM (VALUES ('OHIO','OH'),('IOWA','IA'),('UTAH','UT'),('GUAM','GU')) AS v(bad, code)
WHERE b.state = v.bad;

UPDATE public.businesses
SET country = public.resolve_country(state)
WHERE country IS DISTINCT FROM public.resolve_country(state);