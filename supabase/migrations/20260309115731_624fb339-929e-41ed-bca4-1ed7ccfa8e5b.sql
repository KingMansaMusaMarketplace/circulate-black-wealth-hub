
-- 1. Drop the overly permissive "Leaderboard is public" policy on referral_stats
DROP POLICY IF EXISTS "Leaderboard is public" ON public.referral_stats;

-- 2. Create a safe leaderboard view exposing only non-sensitive columns
CREATE OR REPLACE VIEW public.referral_stats_leaderboard AS
SELECT
  user_id,
  total_referrals,
  current_tier,
  rank
FROM public.referral_stats;

-- 3. Grant SELECT on the view to authenticated and anon roles
GRANT SELECT ON public.referral_stats_leaderboard TO authenticated;
GRANT SELECT ON public.referral_stats_leaderboard TO anon;
