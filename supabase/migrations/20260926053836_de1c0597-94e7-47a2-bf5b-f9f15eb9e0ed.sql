CREATE OR REPLACE FUNCTION public.activate_stays_beta_tester(p_email text, p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_tester_id UUID;
BEGIN
  IF NOT public._beta_caller_ok(p_email, p_user_id) THEN RETURN FALSE; END IF;
  SELECT id INTO v_tester_id FROM public.stays_beta_testers
  WHERE lower(email) = lower(p_email) AND status = 'invited' AND user_id IS NULL
    AND (expiration_date IS NULL OR expiration_date > now());
  IF v_tester_id IS NULL THEN RETURN FALSE; END IF;
  UPDATE public.stays_beta_testers SET user_id = p_user_id, status = 'active', signed_up_at = now(), updated_at = now()
  WHERE id = v_tester_id;
  RETURN TRUE;
END; $$;