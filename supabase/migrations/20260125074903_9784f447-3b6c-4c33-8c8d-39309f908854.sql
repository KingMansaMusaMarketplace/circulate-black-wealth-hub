-- Fix partner_leaderboard view to use SECURITY INVOKER instead of SECURITY DEFINER
-- This ensures RLS policies are enforced based on the querying user, not the view creator

DROP VIEW IF EXISTS public.partner_leaderboard;

CREATE VIEW public.partner_leaderboard
WITH (security_invoker=on) AS
SELECT 
  id,
  directory_name,
  logo_url,
  commission_tier,
  total_referrals,
  total_conversions,
  total_earnings,
  lifetime_referrals,
  CASE
    WHEN (total_referrals > 0) THEN round((((total_conversions)::numeric / (total_referrals)::numeric) * (100)::numeric), 1)
    ELSE (0)::numeric
  END AS conversion_rate,
  rank() OVER (ORDER BY total_earnings DESC) AS earnings_rank,
  rank() OVER (ORDER BY total_referrals DESC) AS referrals_rank,
  created_at
FROM directory_partners dp
WHERE ((status = 'active'::partner_status) AND (leaderboard_opt_in = true));

-- Add comment for documentation
COMMENT ON VIEW public.partner_leaderboard IS 'Public leaderboard view for directory partners. Uses SECURITY INVOKER to enforce RLS policies of the querying user.';