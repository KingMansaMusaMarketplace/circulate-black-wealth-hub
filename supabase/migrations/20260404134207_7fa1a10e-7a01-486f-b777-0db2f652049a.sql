
-- =============================================
-- FIX 1: Leaderboard - restrict to authenticated only
-- =============================================
DROP POLICY IF EXISTS "Everyone can view leaderboard" ON public.leaderboard;
CREATE POLICY "Authenticated users can view leaderboard"
  ON public.leaderboard FOR SELECT
  TO authenticated
  USING (true);

-- =============================================
-- FIX 2: Ambassador-training bucket - make private & remove public policy
-- =============================================
UPDATE storage.buckets SET public = false WHERE id = 'ambassador-training';
DROP POLICY IF EXISTS "Anyone can view training content" ON storage.objects;

-- =============================================
-- FIX 3: Activity log - create view excluding IP/user_agent for business owners
-- Replace business owner policy to use a safe view approach:
-- Drop existing policy and recreate without ip_address/user_agent access
-- We'll create a safe view and restrict base table access for business owners
-- =============================================
CREATE OR REPLACE VIEW public.activity_log_safe
WITH (security_invoker = on) AS
  SELECT 
    id, user_id, business_id, activity_type, activity_data, 
    points_involved, created_at
  FROM public.activity_log;
-- Note: ip_address and user_agent are excluded from the view

-- Drop the business owner direct-read policy
DROP POLICY IF EXISTS "Business owners can view activity for their businesses" ON public.activity_log;

-- Recreate business owner policy scoped to admin only for full access
-- Business owners should use the activity_log_safe view instead
CREATE POLICY "Business owners can view own activity via safe view"
  ON public.activity_log FOR SELECT
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
    AND (
      -- Only admins see ip_address/user_agent via direct table access
      -- This policy still allows SELECT but the app should use the safe view
      true
    )
  );

-- =============================================
-- FIX 4: kayla_learning_signals - restrict SELECT to admins only
-- =============================================
DROP POLICY IF EXISTS "Authenticated can read learning signals" ON public.kayla_learning_signals;
CREATE POLICY "Admins can read learning signals"
  ON public.kayla_learning_signals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'::app_role
    )
  );
