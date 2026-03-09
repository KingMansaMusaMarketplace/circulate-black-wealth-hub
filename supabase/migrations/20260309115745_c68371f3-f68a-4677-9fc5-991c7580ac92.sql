
-- Fix the view to use SECURITY INVOKER (prevents linter warning)
ALTER VIEW public.referral_stats_leaderboard SET (security_invoker = on);
