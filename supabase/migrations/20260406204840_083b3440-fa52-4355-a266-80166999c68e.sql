
-- ============================================
-- 1. PROFILES: Block sensitive column updates via trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.protect_profiles_sensitive_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow service_role or admin to change sensitive fields
  IF NOT is_admin_secure() THEN
    NEW.wallet_balance := OLD.wallet_balance;
    NEW.economic_karma := OLD.economic_karma;
    NEW.subscription_tier := OLD.subscription_tier;
    NEW.subscription_status := OLD.subscription_status;
    NEW.subscription_end_date := OLD.subscription_end_date;
    NEW.is_founding_member := OLD.is_founding_member;
    NEW.is_hbcu_member := OLD.is_hbcu_member;
    NEW.hbcu_verification_status := OLD.hbcu_verification_status;
    NEW.referral_tier := OLD.referral_tier;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profiles_sensitive_fields_trigger ON public.profiles;
CREATE TRIGGER protect_profiles_sensitive_fields_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profiles_sensitive_fields();

-- ============================================
-- 2. LOYALTY_POINTS: Remove user write policies
-- ============================================
DROP POLICY IF EXISTS "System can insert loyalty points" ON public.loyalty_points;
DROP POLICY IF EXISTS "System can update loyalty points" ON public.loyalty_points;

-- Only service_role and admins can write
CREATE POLICY "Only admins can insert loyalty points"
  ON public.loyalty_points FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_secure());

CREATE POLICY "Only admins can update loyalty points"
  ON public.loyalty_points FOR UPDATE
  TO authenticated
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- ============================================
-- 3. COALITION_POINTS: Remove user UPDATE policy
-- ============================================
DROP POLICY IF EXISTS "Users can update own coalition points" ON public.coalition_points;

-- Only admins can update (the ALL admin policy already exists)

-- ============================================
-- 4. REFERRAL_STATS: Remove user write policies
-- ============================================
DROP POLICY IF EXISTS "Users can insert their own stats" ON public.referral_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.referral_stats;

-- Add admin/service write policies
CREATE POLICY "Only admins can insert referral stats"
  ON public.referral_stats FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_secure());

CREATE POLICY "Only admins can update referral stats"
  ON public.referral_stats FOR UPDATE
  TO authenticated
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- ============================================
-- 5. REFERRAL_STREAKS: Replace ALL with SELECT only for users
-- ============================================
DROP POLICY IF EXISTS "Users manage own streaks" ON public.referral_streaks;

-- Users can only read their own streaks (the separate SELECT policy already exists)
-- Admin ALL policy already exists for writes

-- ============================================
-- 6. COMMUNITY_IMPACT_METRICS: Remove user write policies
-- ============================================
DROP POLICY IF EXISTS "Users can insert their own impact metrics" ON public.community_impact_metrics;
DROP POLICY IF EXISTS "Users can update their own impact metrics" ON public.community_impact_metrics;

-- Add admin-only write policies
CREATE POLICY "Only admins can insert impact metrics"
  ON public.community_impact_metrics FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_secure());

CREATE POLICY "Only admins can update impact metrics"
  ON public.community_impact_metrics FOR UPDATE
  TO authenticated
  USING (is_admin_secure())
  WITH CHECK (is_admin_secure());

-- ============================================
-- 7. VERIFICATION_DOCUMENTS: Admin SELECT policy
-- ============================================
CREATE POLICY "Admins can view all verification documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'verification_documents'
    AND is_admin_secure()
  );
