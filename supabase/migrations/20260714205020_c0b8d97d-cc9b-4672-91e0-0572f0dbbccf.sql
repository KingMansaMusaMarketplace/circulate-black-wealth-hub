-- SECURITY DEFINER hardening: revoke EXECUTE from anon on all SECURITY DEFINER
-- functions in public EXCEPT an explicit whitelist required for public flows.

DO $$
DECLARE
  fn record;
  whitelist text[] := ARRAY[
    -- RLS helpers (must be callable from anon SELECT policies)
    'has_role','has_confirmed_booking_for_property','has_transacted_with_business',
    'is_admin','is_admin_for_view','is_admin_or_service','is_admin_secure',
    'is_business_owner','is_business_owner_or_manager','is_business_suspended',
    'is_beta_tester','is_stays_beta_tester','is_circle_member','is_noir_concierge_for',
    'is_savings_circle_creator','is_savings_circle_member',
    'is_shopping_list_creator','is_shopping_list_member',
    'is_user_suspended','is_valid_stays_beta_code',
    'can_view_business_contact','get_user_role',

    -- Rate limiters (called pre-auth on login/signup)
    'check_auth_rate_limit_secure','check_auth_rate_limit_v2',
    'check_rate_limit','check_rate_limit_secure',
    'check_ai_assistant_rate_limit','check_api_rate_limit',
    'check_function_exists',

    -- Beta signup flows (pre-auth)
    'activate_beta_tester','activate_stays_beta_tester',
    'auto_activate_beta_tester','auto_activate_stays_beta_tester',
    'redeem_beta_code',

    -- QR loyalty (JWT validated inside)
    'award_qr_scan','track_qr_scan',

    -- Token-authenticated claim flows
    'claim_business_lead','claim_b2b_lead',
    'verify_claim_token','generate_claim_token','get_invitation_by_token',

    -- Public directory reads
    'get_directory_business_by_id','get_directory_business_by_slug',
    'get_directory_businesses','get_directory_categories','get_directory_map_markers',
    'get_public_business_by_id','get_public_business_info','get_public_businesses',
    'get_public_external_leads','get_public_profile_info',
    'get_public_referral_codes','get_public_referral_codes_only',
    'get_public_vacation_properties','get_safe_business_listings',
    'search_directory_businesses','search_public_businesses',
    'search_safe_businesses','search_lease_listings',
    'get_businesses_by_category_slug','get_businesses_by_city_and_categories',
    'get_businesses_by_city_slug','get_nearby_businesses',
    'list_city_category_counts','list_landing_categories','list_landing_cities',

    -- Public stats/leaderboards
    'get_platform_stats','get_active_campaigns','get_active_referral_codes',
    'get_founding_slots_claimed_count','get_impact_leaderboard',
    'get_agent_leaderboard','get_campaign_leaderboard','get_coalition_stats',
    'get_platform_commission_summary','get_business_referral_info',

    -- Validators and sanitizers (called from client)
    'validate_input','validate_referral_code','validate_uuid_input',
    'sanitize_text_input',

    -- Pure calculators (no privileged data)
    'calculate_asset_depreciation','calculate_business_impact_scorecard',
    'calculate_coalition_tier','calculate_profile_completion',
    'calculate_team_bonus','get_tier_multiplier',

    -- Auth triggers (must fire on new anon signups)
    'handle_new_user','handle_new_user_referral'
  ];
  revoked_count int := 0;
BEGIN
  FOR fn IN
    SELECT n.nspname, p.proname,
           pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
      AND has_function_privilege('anon', p.oid, 'EXECUTE')
      AND NOT (p.proname = ANY(whitelist))
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM anon',
                   fn.nspname, fn.proname, fn.args);
    revoked_count := revoked_count + 1;
  END LOOP;

  RAISE NOTICE 'SECURITY DEFINER hardening: revoked EXECUTE from anon on % functions', revoked_count;
END $$;