DO $$
DECLARE r record; def text;
BEGIN
  -- 1) System-only actions
  FOR r IN SELECT p.oid::regprocedure AS sig FROM pg_proc p WHERE p.pronamespace='public'::regnamespace AND p.proname IN (
    'add_marketing_topup_credits','award_coalition_points','claim_kayla_events','consume_marketing_credit',
    'increment_community_wealth','insert_fraud_alerts_batch','log_api_usage','record_commission',
    'refill_expired_marketing_credits','refund_marketing_credit','reset_auth_rate_limit','validate_api_key',
    'get_leads_needing_enrichment','verify_cashier_pin','credit_partner_referral_on_payment')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.sig);
  END LOOP;

  -- 2) Admin-only guards
  FOR r IN SELECT p.oid FROM pg_proc p WHERE p.pronamespace='public'::regnamespace
    AND p.proname IN ('approve_verification_with_certificate','get_admin_notification_preferences')
  LOOP
    def := pg_get_functiondef(r.oid);
    def := regexp_replace(def, '\mBEGIN\M',
      'BEGIN
  IF coalesce(auth.role(),'''') <> ''service_role'' AND NOT public.has_role(auth.uid(), ''admin''::app_role) THEN
    RAISE EXCEPTION ''Admins only'' USING ERRCODE = ''42501'';
  END IF;', '');
    def := replace(def, 'verified_by = p_admin_id', 'verified_by = coalesce(auth.uid(), p_admin_id)');
    def := replace(def, 'WHERE admin_user_id = p_admin_id', 'WHERE admin_user_id = coalesce(auth.uid(), p_admin_id)');
    EXECUTE def;
  END LOOP;

  -- 3) Own-account-only guards
  FOR r IN SELECT p.oid FROM pg_proc p WHERE p.pronamespace='public'::regnamespace
    AND p.proname IN ('create_user_referral','update_user_streak','track_material_download','log_user_activity','mark_qr_scan_converted','create_sales_agent_application_secure')
  LOOP
    def := pg_get_functiondef(r.oid);
    def := regexp_replace(def, '\mBEGIN\M',
      'BEGIN
  IF coalesce(auth.role(),'''') <> ''service_role'' AND p_user_id IS DISTINCT FROM auth.uid()
     AND NOT public.has_role(auth.uid(), ''admin''::app_role) THEN
    RAISE EXCEPTION ''You can only do this for your own account'' USING ERRCODE = ''42501'';
  END IF;', '');
    EXECUTE def;
  END LOOP;
END $$;