
-- 1) Code-first activation: prefer code match, ignore email mismatch, log mismatches
CREATE OR REPLACE FUNCTION public.activate_beta_tester(p_email text, p_user_id text, p_beta_code text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tester_id uuid;
  v_invite_email text;
BEGIN
  IF p_beta_code IS NOT NULL AND length(trim(p_beta_code)) > 0 THEN
    -- Match by CODE first, regardless of email
    SELECT id, email INTO v_tester_id, v_invite_email
    FROM public.beta_testers
    WHERE upper(beta_code) = upper(trim(p_beta_code))
      AND status = 'invited'
      AND user_id IS NULL
      AND (expiration_date IS NULL OR expiration_date > now())
    LIMIT 1;
  END IF;

  IF v_tester_id IS NULL THEN
    -- Fallback: email-only match (legacy invites without codes)
    SELECT id, email INTO v_tester_id, v_invite_email
    FROM public.beta_testers
    WHERE lower(email) = lower(p_email)
      AND status = 'invited'
      AND user_id IS NULL
      AND (expiration_date IS NULL OR expiration_date > now())
    LIMIT 1;
  END IF;

  IF v_tester_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE public.beta_testers
  SET user_id = p_user_id::uuid,
      status = 'active',
      signed_up_at = now(),
      updated_at = now()
  WHERE id = v_tester_id;

  -- Audit email mismatch (non-fatal)
  IF v_invite_email IS NOT NULL AND lower(v_invite_email) <> lower(p_email) THEN
    BEGIN
      INSERT INTO public.activity_log (user_id, action, entity_type, entity_id, metadata)
      VALUES (
        p_user_id::uuid,
        'beta_code_email_mismatch',
        'beta_tester',
        v_tester_id,
        jsonb_build_object('invite_email', v_invite_email, 'account_email', p_email)
      );
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  RETURN TRUE;
END;
$$;

-- 2) Self-service redeem for already-signed-up users
CREATE OR REPLACE FUNCTION public.redeem_beta_code(p_beta_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
  v_ok boolean;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;

  v_ok := public.activate_beta_tester(COALESCE(v_email,''), v_uid::text, p_beta_code);

  IF v_ok THEN
    RETURN jsonb_build_object('success', true);
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'invalid_or_used_code');
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_beta_code(text) TO authenticated;

-- 3) Retroactively link Judith (yahoo invite → gmail account)
UPDATE public.beta_testers
SET user_id = '69affe45-32fe-4155-b29d-f1e145b812ff',
    status = 'active',
    signed_up_at = COALESCE(signed_up_at, now()),
    updated_at = now()
WHERE id = '60484240-47c6-4043-a7f8-df3a0970845a'
  AND user_id IS NULL;
