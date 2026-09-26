CREATE OR REPLACE FUNCTION public.generate_claim_token(lead_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_token TEXT;
BEGIN
  IF coalesce(auth.role(),'') <> 'service_role' AND NOT public.can_review_businesses() THEN
    RAISE EXCEPTION 'Not allowed to create claim links' USING ERRCODE = '42501';
  END IF;
  new_token := encode(extensions.gen_random_bytes(32), 'hex');
  UPDATE public.b2b_external_leads
  SET claim_token = new_token, claim_token_expires_at = now() + interval '7 days', claim_status = 'pending'
  WHERE id = lead_id;
  RETURN new_token;
END; $$;
REVOKE EXECUTE ON FUNCTION public.generate_claim_token(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_claim_token(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public._beta_caller_ok(p_email text, p_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE
    WHEN coalesce(auth.role(),'') = 'service_role' THEN true
    WHEN auth.uid() IS NOT NULL THEN auth.uid() = p_user_id
      AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p_user_id AND lower(u.email) = lower(p_email))
    ELSE EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p_user_id
      AND lower(u.email) = lower(p_email) AND u.created_at > now() - interval '1 hour')
  END;
$$;
REVOKE EXECUTE ON FUNCTION public._beta_caller_ok(text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public._beta_caller_ok(text, uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.activate_beta_tester(p_email text, p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_tester_id UUID;
BEGIN
  IF NOT public._beta_caller_ok(p_email, p_user_id) THEN RETURN FALSE; END IF;
  SELECT id INTO v_tester_id FROM public.beta_testers
  WHERE lower(email) = lower(p_email) AND status = 'invited' AND user_id IS NULL
    AND (expiration_date IS NULL OR expiration_date > now());
  IF v_tester_id IS NULL THEN RETURN FALSE; END IF;
  UPDATE public.beta_testers SET user_id = p_user_id, status = 'active', signed_up_at = now(), updated_at = now()
  WHERE id = v_tester_id;
  RETURN TRUE;
END; $$;

CREATE OR REPLACE FUNCTION public.activate_beta_tester(p_email text, p_user_id text, p_beta_code text DEFAULT NULL::text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_tester_id uuid; v_invite_email text;
BEGIN
  IF p_user_id IS NULL OR NOT public._beta_caller_ok(p_email, p_user_id::uuid) THEN RETURN FALSE; END IF;
  IF p_beta_code IS NOT NULL AND length(trim(p_beta_code)) > 0 THEN
    SELECT id, email INTO v_tester_id, v_invite_email FROM public.beta_testers
    WHERE upper(beta_code) = upper(trim(p_beta_code)) AND status = 'invited' AND user_id IS NULL
      AND (expiration_date IS NULL OR expiration_date > now()) LIMIT 1;
  END IF;
  IF v_tester_id IS NULL THEN
    SELECT id, email INTO v_tester_id, v_invite_email FROM public.beta_testers
    WHERE lower(email) = lower(p_email) AND status = 'invited' AND user_id IS NULL
      AND (expiration_date IS NULL OR expiration_date > now()) LIMIT 1;
  END IF;
  IF v_tester_id IS NULL THEN RETURN FALSE; END IF;
  UPDATE public.beta_testers SET user_id = p_user_id::uuid, status = 'active', signed_up_at = now(), updated_at = now()
  WHERE id = v_tester_id;
  IF v_invite_email IS NOT NULL AND lower(v_invite_email) <> lower(p_email) THEN
    BEGIN
      INSERT INTO public.activity_log (user_id, action, entity_type, entity_id, metadata)
      VALUES (p_user_id::uuid, 'beta_code_email_mismatch', 'beta_tester', v_tester_id,
        jsonb_build_object('invite_email', v_invite_email, 'account_email', p_email));
    EXCEPTION WHEN OTHERS THEN NULL; END;
  END IF;
  RETURN TRUE;
END; $$;