DELETE FROM public.b2b_external_leads
WHERE website_url ILIKE '%atlantablackpages%'
   OR website_domain ILIKE '%atlantablackpages%'
   OR business_name ILIKE '%Atlanta Black Pages%'
   OR business_name ILIKE 'Shaw Financial Group Enterprise LLC%';