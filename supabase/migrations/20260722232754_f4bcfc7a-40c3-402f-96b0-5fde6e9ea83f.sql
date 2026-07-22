
-- Move apply_email off the publicly-readable job_postings row into the private table
ALTER TABLE public.job_postings_private
  ADD COLUMN IF NOT EXISTS apply_email text;

UPDATE public.job_postings_private p
SET apply_email = j.apply_email
FROM public.job_postings j
WHERE p.job_id = j.id AND j.apply_email IS NOT NULL;

-- Backfill private rows for any job with apply_email that lacks a private row
INSERT INTO public.job_postings_private (job_id, poster_user_id, apply_email)
SELECT j.id, j.poster_user_id, j.apply_email
FROM public.job_postings j
LEFT JOIN public.job_postings_private p ON p.job_id = j.id
WHERE p.job_id IS NULL AND j.apply_email IS NOT NULL;

-- Drop the column from the public table so it can never be selected by anon
ALTER TABLE public.job_postings DROP COLUMN IF EXISTS apply_email;

-- Authenticated-only RPC to reveal the apply email for a single active job
CREATE OR REPLACE FUNCTION public.get_job_apply_email(_job_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.apply_email
  FROM public.job_postings_private p
  JOIN public.job_postings j ON j.id = p.job_id
  WHERE p.job_id = _job_id
    AND j.status = 'active'
    AND (j.expires_at IS NULL OR j.expires_at > now());
$$;

REVOKE ALL ON FUNCTION public.get_job_apply_email(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_job_apply_email(uuid) TO authenticated;
