-- Backfill linkage for the bulk-promoted leads whose status update was blocked
-- by the verification_status CHECK constraint on the first run, and which the
-- second run then mistakenly marked as 'rejected' (bulk_dedup_domain).
-- Match leads to the businesses created during the bulk-flush window by website_domain.

WITH recent_biz AS (
  SELECT id, website_domain, normalized_name, city, created_at
  FROM public.businesses
  WHERE created_at > now() - interval '2 hours'
    AND website_domain IS NOT NULL
),
candidates AS (
  SELECT l.id AS lead_id, b.id AS biz_id,
         ROW_NUMBER() OVER (PARTITION BY l.id ORDER BY b.created_at ASC) AS rn_lead,
         ROW_NUMBER() OVER (PARTITION BY b.id ORDER BY l.created_at ASC) AS rn_biz
  FROM public.b2b_external_leads l
  JOIN recent_biz b ON b.website_domain = l.website_domain
  WHERE l.is_converted = false
    AND l.website_domain IS NOT NULL
    AND (
      l.verification_status = 'promoted'
      OR (l.verification_status = 'rejected'
          AND l.verification_notes::text ILIKE '%bulk_dedup_domain%')
    )
)
UPDATE public.b2b_external_leads l
SET is_converted = true,
    converted_business_id = c.biz_id,
    verification_status = 'promoted',
    verified_at = COALESCE(l.verified_at, now()),
    verification_notes = COALESCE(l.verification_notes, '[]'::jsonb)
      || jsonb_build_array(jsonb_build_object('reason','bulk_backfill_link','at', now()))
FROM candidates c
WHERE l.id = c.lead_id
  AND c.rn_lead = 1
  AND c.rn_biz = 1;