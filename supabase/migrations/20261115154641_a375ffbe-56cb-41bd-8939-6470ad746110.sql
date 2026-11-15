-- Security cleanup (Nov 15 2026): lock database helpers that visitors or ordinary
-- signed-in users never need. Public directory lookups are intentionally untouched.

-- 1) Membership/ownership helpers: only used by signed-in access rules.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('has_confirmed_booking_for_property','has_transacted_with_business',
                        'is_business_owner_or_manager','is_noir_concierge_for',
                        'is_circle_member','is_savings_circle_creator','is_shopping_list_creator')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated, service_role', r.sig);
  END LOOP;
END $$;

-- Members-only rules that used those helpers apply to signed-in users only
-- (they compare against the signed-in user, so visitors never matched them).
ALTER POLICY "Circle members can view members" ON public.host_circle_members TO authenticated;
ALTER POLICY "Circle members can view resources" ON public.host_circle_resources TO authenticated;
ALTER POLICY "Circle members can share resources" ON public.host_circle_resources TO authenticated;
ALTER POLICY "Members can view their circles" ON public.savings_circle_members TO authenticated;
ALTER POLICY "List members can view other members" ON public.shopping_list_members TO authenticated;
ALTER POLICY "List owners and members can remove themselves" ON public.shopping_list_members TO authenticated;
ALTER POLICY "List owners can add members" ON public.shopping_list_members TO authenticated;
ALTER POLICY "List owners can update member roles" ON public.shopping_list_members TO authenticated;

-- 2) Server-only money, commission, admin and bulk-list functions: backend only.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('credit_wallet','debit_wallet','security_autopilot_snapshot',
                        'process_business_referral','get_active_referral_codes')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', r.sig);
  END LOOP;
END $$;