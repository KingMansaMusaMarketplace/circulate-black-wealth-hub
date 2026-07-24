
-- 1) event_attendees
DROP POLICY IF EXISTS "Authenticated users can view event attendees" ON public.event_attendees;

CREATE POLICY "Attendees, organizers, and admins view attendance"
ON public.event_attendees
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR is_admin_secure()
  OR EXISTS (
    SELECT 1 FROM public.community_events ce
    WHERE ce.id = event_attendees.event_id
      AND ce.organizer_id = auth.uid()
  )
);

-- 2) leaderboard
DROP POLICY IF EXISTS "Authenticated users can view leaderboard" ON public.leaderboard;

CREATE POLICY "Users view own leaderboard row"
ON public.leaderboard
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin_secure());

CREATE OR REPLACE VIEW public.leaderboard_public
WITH (security_invoker = true) AS
SELECT
  l.id,
  l.category,
  l.period,
  l.score,
  l.rank,
  l.updated_at,
  COALESCE(NULLIF(split_part(p.full_name, ' ', 1), ''), 'Anonymous') AS display_name,
  p.avatar_url
FROM public.leaderboard l
LEFT JOIN public.profiles p ON p.id = l.user_id;

GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

-- 3) sales_agent_tests
CREATE OR REPLACE VIEW public.sales_agent_tests_public AS
SELECT id, question, option_a, option_b, option_c, option_d, is_active, created_at
FROM public.sales_agent_tests
WHERE is_active = true;

REVOKE ALL ON public.sales_agent_tests_public FROM PUBLIC, anon;
GRANT SELECT ON public.sales_agent_tests_public TO authenticated;
