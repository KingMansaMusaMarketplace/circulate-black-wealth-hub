CREATE OR REPLACE FUNCTION public.activate_beta_tester(p_email text, p_user_id text, p_beta_code text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tester_id UUID;
BEGIN
  -- If a beta code is provided, validate both email AND code
  IF p_beta_code IS NOT NULL THEN
    SELECT id INTO v_tester_id
    FROM public.beta_testers
    WHERE lower(email) = lower(p_email)
      AND beta_code = p_beta_code
      AND status = 'invited'
      AND user_id IS NULL
      AND (expiration_date IS NULL OR expiration_date > now());
  ELSE
    -- Fallback: match by email only (backward compatible)
    SELECT id INTO v_tester_id
    FROM public.beta_testers
    WHERE lower(email) = lower(p_email)
      AND status = 'invited'
      AND user_id IS NULL
      AND (expiration_date IS NULL OR expiration_date > now());
  END IF;

  IF v_tester_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE public.beta_testers
  SET user_id = p_user_id,
      status = 'active',
      signed_up_at = now(),
      updated_at = now()
  WHERE id = v_tester_id;

  RETURN TRUE;
END;
$$;