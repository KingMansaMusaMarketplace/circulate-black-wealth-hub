-- Function to get agent leaderboard data
CREATE OR REPLACE FUNCTION public.get_agent_leaderboard(
  p_time_period TEXT DEFAULT 'all_time',
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
  agent_id UUID,
  agent_name TEXT,
  referral_code TEXT,
  tier VARCHAR,
  total_referrals INTEGER,
  active_referrals INTEGER,
  rank INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Determine start date based on time period
  CASE p_time_period
    WHEN 'monthly' THEN
      v_start_date := date_trunc('month', now());
    WHEN 'quarterly' THEN
      v_start_date := date_trunc('quarter', now());
    WHEN 'yearly' THEN
      v_start_date := date_trunc('year', now());
    ELSE
      v_start_date := '1970-01-01'::timestamp; -- All time
  END CASE;

  RETURN QUERY
  WITH agent_stats AS (
    SELECT
      sa.id AS agent_id,
      sa.full_name AS agent_name,
      sa.referral_code,
      sa.tier,
      COUNT(r.id) AS total_referrals,
      COUNT(r.id) FILTER (WHERE r.subscription_status = 'active') AS active_referrals
    FROM sales_agents sa
    LEFT JOIN referrals r ON r.sales_agent_id = sa.id 
      AND r.referral_date >= v_start_date
    WHERE sa.is_active = true
    GROUP BY sa.id, sa.full_name, sa.referral_code, sa.tier
  )
  SELECT
    agent_stats.agent_id,
    agent_stats.agent_name,
    agent_stats.referral_code,
    agent_stats.tier,
    agent_stats.total_referrals::INTEGER,
    agent_stats.active_referrals::INTEGER,
    ROW_NUMBER() OVER (ORDER BY agent_stats.total_referrals DESC, agent_stats.active_referrals DESC)::INTEGER AS rank
  FROM agent_stats
  WHERE agent_stats.total_referrals > 0
  ORDER BY rank
  LIMIT p_limit;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_agent_leaderboard TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_agent_leaderboard TO anon;