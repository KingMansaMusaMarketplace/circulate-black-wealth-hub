DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT p.oid::regprocedure AS sig FROM pg_proc p
    WHERE p.pronamespace='public'::regnamespace AND p.proname IN (
      'get_invitation_by_token','get_public_business_by_id','get_public_business_info','get_public_businesses',
      'get_public_referral_codes','get_public_referral_codes_only','get_public_vacation_properties',
      'get_holiday_campaign_stats','check_api_rate_limit','check_auth_rate_limit_v2')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.sig);
  END LOOP;
END $$;