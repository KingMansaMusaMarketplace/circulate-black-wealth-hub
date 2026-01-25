-- Fix security warnings from partner enhancement migration

-- 1. Drop and recreate the view without SECURITY DEFINER
DROP VIEW IF EXISTS public.partner_leaderboard;

CREATE VIEW public.partner_leaderboard AS
SELECT 
  dp.id,
  dp.directory_name,
  dp.logo_url,
  dp.commission_tier,
  dp.total_referrals,
  dp.total_conversions,
  dp.total_earnings,
  dp.lifetime_referrals,
  CASE 
    WHEN dp.total_referrals > 0 THEN ROUND((dp.total_conversions::numeric / dp.total_referrals::numeric) * 100, 1)
    ELSE 0 
  END as conversion_rate,
  RANK() OVER (ORDER BY dp.total_earnings DESC) as earnings_rank,
  RANK() OVER (ORDER BY dp.total_referrals DESC) as referrals_rank,
  dp.created_at
FROM public.directory_partners dp
WHERE dp.status = 'active' 
  AND dp.leaderboard_opt_in = true;

-- 2. Fix the overly permissive INSERT policy on partner_link_clicks
DROP POLICY IF EXISTS "System can insert clicks" ON public.partner_link_clicks;

-- Allow inserts from authenticated users only (for logged-in referral tracking)
-- or from service role for webhook/edge function inserts
CREATE POLICY "Authenticated users can insert clicks"
  ON public.partner_link_clicks FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- For anonymous click tracking (before signup), we need service_role access
-- This will be handled via edge function with service role

-- Grant access to the view
GRANT SELECT ON public.partner_leaderboard TO authenticated, anon;