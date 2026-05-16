-- Drop the overly permissive public-read policy
DROP POLICY IF EXISTS "Anyone can check stays beta status" ON public.stays_beta_testers;

-- Allow signed-in users to view ONLY their own record
-- (matched by user_id, or by email if user_id wasn't yet linked)
CREATE POLICY "Users view own stays beta record"
ON public.stays_beta_testers
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR lower(email) = lower(coalesce((auth.jwt() ->> 'email')::text, ''))
);

-- Privacy-safe helper for "is this beta code valid?" checks without
-- leaking the underlying row. Returns boolean only.
CREATE OR REPLACE FUNCTION public.is_valid_stays_beta_code(code text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.stays_beta_testers
    WHERE beta_code = code
      AND status = 'active'
      AND (expiration_date IS NULL OR expiration_date > now())
  );
$$;

REVOKE ALL ON FUNCTION public.is_valid_stays_beta_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_valid_stays_beta_code(text) TO anon, authenticated;