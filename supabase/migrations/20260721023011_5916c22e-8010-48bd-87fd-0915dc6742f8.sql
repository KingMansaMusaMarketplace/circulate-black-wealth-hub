DO $$
DECLARE fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'guard_business_verifications','guard_host_verification_requests','guard_host_applications',
    'guard_hbcu_verifications','guard_non_bias_certifications','guard_verification_certificates',
    'guard_noir_hotel_partners','guard_beta_testers','guard_stays_beta_testers','guard_developer_accounts',
    'guard_money_admin_only','guard_bank_accounts','guard_host_payout_methods',
    'guard_business_payment_accounts','guard_apple_subscriptions','guard_sponsors',
    'guard_partner_referrals','guard_admin_only','guard_user_roles','guard_reviews'
  ] LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%I() FROM PUBLIC, anon, authenticated', fn);
  END LOOP;
END $$;