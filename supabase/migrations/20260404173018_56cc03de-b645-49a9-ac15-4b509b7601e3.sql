
-- Drop and recreate the safe view without PII columns
DROP VIEW IF EXISTS public.activity_log_safe;
CREATE VIEW public.activity_log_safe
WITH (security_invoker = on) AS
SELECT
  id, activity_type, business_id, user_id,
  points_involved, activity_data, created_at
FROM public.activity_log;

-- Update policies
DROP POLICY IF EXISTS "Business owners can view own activity via safe view" ON public.activity_log;
DROP POLICY IF EXISTS "Business owners can view own activity" ON public.activity_log;
DROP POLICY IF EXISTS "Admins can view full activity log" ON public.activity_log;

CREATE POLICY "Admins can view full activity log"
  ON public.activity_log FOR SELECT
  TO authenticated
  USING (public.is_admin_secure());

CREATE POLICY "Business owners can view own activity"
  ON public.activity_log FOR SELECT
  TO authenticated
  USING (
    business_id IS NOT NULL
    AND EXISTS (SELECT 1 FROM businesses b WHERE b.id = activity_log.business_id AND b.owner_id = auth.uid())
  );
