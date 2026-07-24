
-- Make leaderboard_public run as invoker so it doesn't trigger security-definer-view lint
DROP VIEW IF EXISTS public.leaderboard_public;
CREATE VIEW public.leaderboard_public
WITH (security_invoker = true) AS
SELECT
  l.id, l.category, l.period, l.score, l.rank, l.updated_at,
  COALESCE(NULLIF(split_part(p.full_name, ' ', 1), ''), 'Anonymous') AS display_name,
  p.avatar_url
FROM public.leaderboard l
LEFT JOIN public.profiles p ON p.id = l.user_id;
GRANT SELECT ON public.leaderboard_public TO anon, authenticated;

-- Drop the view approach for sales_agent_tests; use column-level grants + RLS policy instead
DROP VIEW IF EXISTS public.sales_agent_tests_public;

CREATE POLICY "Authenticated can read active test questions"
ON public.sales_agent_tests
FOR SELECT
TO authenticated
USING (is_active = true);

-- Restrict which columns authenticated role can read (correct_answer excluded)
REVOKE SELECT ON public.sales_agent_tests FROM authenticated;
GRANT SELECT (id, question, option_a, option_b, option_c, option_d, is_active, created_at)
  ON public.sales_agent_tests TO authenticated;
