
-- ============================================================================
-- Replace all policies that depend on has_role(uuid, text) with is_admin_secure()
-- Then drop the vulnerable text overload
-- ============================================================================

-- 1. directory_partners
DROP POLICY IF EXISTS "Admins can manage all partners" ON public.directory_partners;
CREATE POLICY "Admins can manage all partners"
ON public.directory_partners FOR ALL
TO authenticated
USING (public.is_admin_secure());

-- 2. partner_referrals
DROP POLICY IF EXISTS "Admins can manage all referrals" ON public.partner_referrals;
CREATE POLICY "Admins can manage all referrals"
ON public.partner_referrals FOR ALL
TO authenticated
USING (public.is_admin_secure());

-- 3. partner_payouts
DROP POLICY IF EXISTS "Admins can manage all payouts" ON public.partner_payouts;
CREATE POLICY "Admins can manage all payouts"
ON public.partner_payouts FOR ALL
TO authenticated
USING (public.is_admin_secure());

-- 4. marketing_materials
DROP POLICY IF EXISTS "Admins can manage marketing materials" ON public.marketing_materials;
CREATE POLICY "Admins can manage marketing materials"
ON public.marketing_materials FOR ALL
TO authenticated
USING (public.is_admin_secure())
WITH CHECK (public.is_admin_secure());

-- 5. noir_drivers
DROP POLICY IF EXISTS "Drivers can view own profile" ON public.noir_drivers;
CREATE POLICY "Drivers can view own profile"
ON public.noir_drivers FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin_secure());

-- 6. host_verification_requests (SELECT)
DROP POLICY IF EXISTS "Hosts can view own verification requests" ON public.host_verification_requests;
CREATE POLICY "Hosts can view own verification requests"
ON public.host_verification_requests FOR SELECT TO authenticated
USING (host_id = auth.uid() OR public.is_admin_secure());

-- 7. host_verification_requests (UPDATE)
DROP POLICY IF EXISTS "Only admins can update verification requests" ON public.host_verification_requests;
CREATE POLICY "Only admins can update verification requests"
ON public.host_verification_requests FOR UPDATE TO authenticated
USING (public.is_admin_secure());

-- 8. pricing_recommendations
DROP POLICY IF EXISTS "Users can insert pricing recommendations" ON public.pricing_recommendations;
CREATE POLICY "Users can insert pricing recommendations"
ON public.pricing_recommendations FOR INSERT TO authenticated
WITH CHECK (host_id = auth.uid() OR public.is_admin_secure());

-- ============================================================================
-- Now safe to drop the vulnerable text overload
-- ============================================================================
DROP FUNCTION IF EXISTS public.has_role(uuid, text);
