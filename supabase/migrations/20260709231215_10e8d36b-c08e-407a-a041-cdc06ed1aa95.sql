CREATE OR REPLACE FUNCTION public.credit_wallet(p_user_id uuid, p_amount numeric, p_source text, p_description text DEFAULT NULL::text, p_reference_id uuid DEFAULT NULL::uuid, p_reference_type text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_balance_before DECIMAL;
  v_balance_after DECIMAL;
  v_transaction_id UUID;
BEGIN
  -- Authorization: allow service_role (backend edge functions) or admins
  IF current_setting('role', true) IS DISTINCT FROM 'service_role'
     AND NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'unauthorized: admin privileges required to credit wallet';
  END IF;

  SELECT wallet_balance INTO v_balance_before FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF v_balance_before IS NULL THEN RAISE EXCEPTION 'User profile not found'; END IF;
  v_balance_after := v_balance_before + p_amount;
  UPDATE profiles SET wallet_balance = v_balance_after WHERE id = p_user_id;
  INSERT INTO wallet_transactions (user_id, amount, transaction_type, source, reference_id, reference_type, description, balance_before, balance_after)
  VALUES (p_user_id, p_amount, 'credit', p_source, p_reference_id, p_reference_type, p_description, v_balance_before, v_balance_after)
  RETURNING id INTO v_transaction_id;
  RETURN v_transaction_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.debit_wallet(p_user_id uuid, p_amount numeric, p_source text, p_description text DEFAULT NULL::text, p_reference_id uuid DEFAULT NULL::uuid, p_reference_type text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_balance_before DECIMAL;
  v_balance_after DECIMAL;
  v_transaction_id UUID;
BEGIN
  -- Authorization: wallet owner, admins, or service_role
  IF current_setting('role', true) IS DISTINCT FROM 'service_role'
     AND auth.uid() IS DISTINCT FROM p_user_id
     AND NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'unauthorized: cannot debit another user''s wallet';
  END IF;

  SELECT wallet_balance INTO v_balance_before FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF v_balance_before IS NULL THEN RAISE EXCEPTION 'User profile not found'; END IF;
  IF v_balance_before < p_amount THEN RAISE EXCEPTION 'Insufficient wallet balance'; END IF;
  v_balance_after := v_balance_before - p_amount;
  UPDATE profiles SET wallet_balance = v_balance_after WHERE id = p_user_id;
  INSERT INTO wallet_transactions (user_id, amount, transaction_type, source, reference_id, reference_type, description, balance_before, balance_after)
  VALUES (p_user_id, p_amount, 'debit', p_source, p_reference_id, p_reference_type, p_description, v_balance_before, v_balance_after)
  RETURNING id INTO v_transaction_id;
  RETURN v_transaction_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_withdrawal(p_request_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_request RECORD;
  v_wallet_balance DECIMAL;
BEGIN
  IF current_setting('role', true) IS DISTINCT FROM 'service_role'
     AND NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'unauthorized: admin privileges required to process withdrawal';
  END IF;

  SELECT * INTO v_request FROM withdrawal_requests WHERE id = p_request_id FOR UPDATE;
  IF v_request IS NULL THEN RAISE EXCEPTION 'Withdrawal request not found'; END IF;
  IF v_request.status != 'approved' THEN RAISE EXCEPTION 'Request must be approved before processing'; END IF;

  SELECT wallet_balance INTO v_wallet_balance FROM profiles WHERE id = v_request.user_id FOR UPDATE;
  IF v_wallet_balance < v_request.amount THEN
    UPDATE withdrawal_requests
    SET status = 'failed', admin_notes = COALESCE(admin_notes,'') || ' | Failed: Insufficient balance', updated_at = now()
    WHERE id = p_request_id;
    RETURN FALSE;
  END IF;

  PERFORM debit_wallet(v_request.user_id, v_request.amount, 'withdrawal', 'Cash-out withdrawal', p_request_id, 'withdrawal_request');

  UPDATE withdrawal_requests SET status = 'processing', processed_at = now(), updated_at = now() WHERE id = p_request_id;
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.complete_withdrawal(p_request_id uuid, p_transaction_reference text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF current_setting('role', true) IS DISTINCT FROM 'service_role'
     AND NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'unauthorized: admin privileges required to complete withdrawal';
  END IF;

  UPDATE withdrawal_requests
  SET status = 'completed',
      completed_at = now(),
      transaction_reference = COALESCE(p_transaction_reference, transaction_reference),
      updated_at = now()
  WHERE id = p_request_id AND status = 'processing';
  RETURN FOUND;
END;
$function$;