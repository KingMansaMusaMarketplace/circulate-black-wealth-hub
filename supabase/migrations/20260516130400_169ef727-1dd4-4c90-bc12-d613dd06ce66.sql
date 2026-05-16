DO $$
DECLARE
  v_test_email TEXT := 'staysbeta-e2e-' || extract(epoch from now())::bigint || '@mansatest.local';
  v_real_user_id UUID;
  v_inserted_id UUID;
  v_inserted_code TEXT;
  v_activated BOOLEAN;
  v_status TEXT;
  v_user_id UUID;
  v_signed_up_at TIMESTAMPTZ;
  v_orig_email TEXT;
BEGIN
  -- Pick any real auth user to satisfy FK (we never modify them)
  SELECT id INTO v_real_user_id FROM auth.users LIMIT 1;
  IF v_real_user_id IS NULL THEN
    RAISE EXCEPTION 'No auth users exist to use for FK test';
  END IF;

  -- Save original email of this user (if a stays_beta row already exists for them, we skip)
  IF EXISTS (SELECT 1 FROM public.stays_beta_testers WHERE user_id = v_real_user_id) THEN
    -- Use the second user to avoid clobbering
    SELECT id INTO v_real_user_id FROM auth.users
    WHERE id NOT IN (SELECT user_id FROM public.stays_beta_testers WHERE user_id IS NOT NULL)
    LIMIT 1;
    IF v_real_user_id IS NULL THEN
      RAISE EXCEPTION 'Could not find a user without an existing stays_beta row';
    END IF;
  END IF;

  BEGIN
    -- 1) Insert invited row
    INSERT INTO public.stays_beta_testers (full_name, email, notes)
    VALUES ('E2E Test User', v_test_email, 'AUTOMATED E2E TEST — auto-deleted')
    RETURNING id, beta_code INTO v_inserted_id, v_inserted_code;
    RAISE NOTICE '✅ Step 1: Invited row created. id=% code=%', v_inserted_id, v_inserted_code;

    IF v_inserted_code IS NULL OR length(v_inserted_code) < 6 THEN
      RAISE EXCEPTION 'beta_code not auto-generated';
    END IF;

    -- 2) Activate via RPC (the exact call auth-signup.ts makes)
    SELECT public.activate_stays_beta_tester(v_test_email, v_real_user_id) INTO v_activated;
    IF NOT v_activated THEN RAISE EXCEPTION 'RPC returned FALSE on first call'; END IF;
    RAISE NOTICE '✅ Step 2: activate_stays_beta_tester RPC returned TRUE';

    -- 3) Verify activation
    SELECT status, user_id, signed_up_at INTO v_status, v_user_id, v_signed_up_at
    FROM public.stays_beta_testers WHERE id = v_inserted_id;
    IF v_status <> 'active'      THEN RAISE EXCEPTION 'Expected status=active, got %', v_status; END IF;
    IF v_user_id <> v_real_user_id THEN RAISE EXCEPTION 'user_id mismatch'; END IF;
    IF v_signed_up_at IS NULL    THEN RAISE EXCEPTION 'signed_up_at not set'; END IF;
    RAISE NOTICE '✅ Step 3: Row marked active and linked to user_id=%', v_user_id;

    -- 4) is_stays_beta_tester returns true
    IF NOT public.is_stays_beta_tester(v_test_email) THEN
      RAISE EXCEPTION 'is_stays_beta_tester returned FALSE';
    END IF;
    RAISE NOTICE '✅ Step 4: is_stays_beta_tester() returns TRUE';

    -- 5) Idempotency — second activation call should return FALSE
    SELECT public.activate_stays_beta_tester(v_test_email, v_real_user_id) INTO v_activated;
    IF v_activated THEN RAISE EXCEPTION 'RPC should be idempotent (returned TRUE on 2nd call)'; END IF;
    RAISE NOTICE '✅ Step 5: RPC is idempotent';

    -- 6) Trigger test: insert a temp profile row with a fresh test email and an invited row
    --    This exercises trg_auto_activate_stays_beta_tester on profiles.
    DECLARE
      v_trigger_email TEXT := 'staysbeta-trigger-' || extract(epoch from now())::bigint || '@mansatest.local';
      v_trigger_row_id UUID;
    BEGIN
      INSERT INTO public.stays_beta_testers (full_name, email, notes)
      VALUES ('Trigger Test', v_trigger_email, 'AUTO TEST — trigger path')
      RETURNING id INTO v_trigger_row_id;

      -- Capture user's current email so we can restore
      SELECT email INTO v_orig_email FROM public.profiles WHERE id = v_real_user_id;

      -- Fire the trigger by updating the user's profile email to the test email
      UPDATE public.profiles SET email = v_trigger_email WHERE id = v_real_user_id;

      -- Check status
      SELECT status INTO v_status FROM public.stays_beta_testers WHERE id = v_trigger_row_id;

      -- Restore email FIRST so user isn't broken even if assertion fails
      UPDATE public.profiles SET email = v_orig_email WHERE id = v_real_user_id;

      IF v_status <> 'active' THEN
        DELETE FROM public.stays_beta_testers WHERE id = v_trigger_row_id;
        RAISE EXCEPTION 'Trigger did not activate row (status=%)', v_status;
      END IF;
      RAISE NOTICE '✅ Step 6: trg_auto_activate_stays_beta_tester fired correctly on profile email update';

      DELETE FROM public.stays_beta_testers WHERE id = v_trigger_row_id;
    END;

    -- 7) Cleanup primary test row
    DELETE FROM public.stays_beta_testers WHERE id = v_inserted_id;
    RAISE NOTICE '✅ Step 7: Test rows cleaned up';
    RAISE NOTICE '🎉 ALL CHECKS PASSED — Mansa Stays beta pipeline is verified end-to-end';

  EXCEPTION WHEN OTHERS THEN
    -- Always restore the user's email if we changed it
    IF v_orig_email IS NOT NULL THEN
      UPDATE public.profiles SET email = v_orig_email WHERE id = v_real_user_id;
    END IF;
    -- Always clean up
    DELETE FROM public.stays_beta_testers WHERE email LIKE 'staysbeta-e2e-%@mansatest.local';
    DELETE FROM public.stays_beta_testers WHERE email LIKE 'staysbeta-trigger-%@mansatest.local';
    RAISE;
  END;
END $$;