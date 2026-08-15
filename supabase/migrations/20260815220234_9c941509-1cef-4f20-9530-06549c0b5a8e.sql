UPDATE public.outreach_targets
SET website = 'https://' || website,
    updated_at = now()
WHERE website IS NOT NULL
  AND btrim(website) <> ''
  AND website !~* '^https?://';