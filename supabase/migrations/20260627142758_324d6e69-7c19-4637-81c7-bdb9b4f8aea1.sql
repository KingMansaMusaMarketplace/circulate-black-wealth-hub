
-- Lock down profiles: restrict self-update to non-privileged columns
DROP POLICY IF EXISTS "Users can update their own basic profile data secure" ON public.profiles;
CREATE POLICY "Users can update their own basic profile data secure"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND user_type IS NOT DISTINCT FROM (SELECT p.user_type FROM public.profiles p WHERE p.id = auth.uid())
  AND wallet_balance IS NOT DISTINCT FROM (SELECT p.wallet_balance FROM public.profiles p WHERE p.id = auth.uid())
  AND subscription_status IS NOT DISTINCT FROM (SELECT p.subscription_status FROM public.profiles p WHERE p.id = auth.uid())
  AND subscription_tier IS NOT DISTINCT FROM (SELECT p.subscription_tier FROM public.profiles p WHERE p.id = auth.uid())
  AND is_founding_member IS NOT DISTINCT FROM (SELECT p.is_founding_member FROM public.profiles p WHERE p.id = auth.uid())
  AND is_verified_host IS NOT DISTINCT FROM (SELECT p.is_verified_host FROM public.profiles p WHERE p.id = auth.uid())
  AND economic_karma IS NOT DISTINCT FROM (SELECT p.economic_karma FROM public.profiles p WHERE p.id = auth.uid())
  AND identity_status IS NOT DISTINCT FROM (SELECT p.identity_status FROM public.profiles p WHERE p.id = auth.uid())
);

-- noire_community_credits: SELECT only for users; writes via service role
DROP POLICY IF EXISTS "Users view own credits" ON public.noire_community_credits;
CREATE POLICY "Users view own credits"
ON public.noire_community_credits
FOR SELECT
USING (auth.uid() = user_id);

-- noire_credit_transactions: remove user INSERT, keep SELECT only
DROP POLICY IF EXISTS "Users create own transactions" ON public.noire_credit_transactions;

-- noire_ride_impact: SELECT only for users
DROP POLICY IF EXISTS "Users view own impact" ON public.noire_ride_impact;
CREATE POLICY "Users view own impact"
ON public.noire_ride_impact
FOR SELECT
USING (auth.uid() = user_id);
