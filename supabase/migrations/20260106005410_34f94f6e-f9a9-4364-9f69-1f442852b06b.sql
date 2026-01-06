-- Fix search_path for all new functions
CREATE OR REPLACE FUNCTION public.get_active_campaigns()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  campaign_type TEXT,
  bonus_multiplier NUMERIC,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_joined BOOLEAN,
  participant_count BIGINT,
  my_rank INTEGER,
  my_referrals INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.description,
    c.campaign_type,
    c.bonus_multiplier,
    c.start_date,
    c.end_date,
    (p.user_id IS NOT NULL) AS is_joined,
    (SELECT COUNT(*) FROM public.referral_campaign_participants WHERE campaign_id = c.id) AS participant_count,
    p.rank AS my_rank,
    COALESCE(p.referrals_during_campaign, 0) AS my_referrals
  FROM public.referral_campaigns c
  LEFT JOIN public.referral_campaign_participants p ON c.id = p.campaign_id AND p.user_id = auth.uid()
  WHERE c.is_active = true
    AND c.start_date <= now()
    AND c.end_date >= now()
  ORDER BY c.is_featured DESC, c.end_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_user_milestone_progress()
RETURNS TABLE (
  milestone_id UUID,
  milestone_count INTEGER,
  milestone_name TEXT,
  description TEXT,
  badge_name TEXT,
  badge_icon TEXT,
  badge_color TEXT,
  reward_points INTEGER,
  reward_cash NUMERIC,
  is_unlocked BOOLEAN,
  unlocked_at TIMESTAMPTZ,
  reward_claimed BOOLEAN,
  progress_percent INTEGER
) AS $$
DECLARE
  user_referrals INTEGER;
BEGIN
  SELECT COALESCE(successful_referrals, 0) INTO user_referrals
  FROM public.referral_stats
  WHERE user_id = auth.uid();

  RETURN QUERY
  SELECT 
    m.id AS milestone_id,
    m.milestone_count,
    m.milestone_name,
    m.description,
    m.badge_name,
    m.badge_icon,
    m.badge_color,
    m.reward_points,
    m.reward_cash,
    (ump.id IS NOT NULL) AS is_unlocked,
    ump.unlocked_at,
    COALESCE(ump.reward_claimed, false) AS reward_claimed,
    LEAST(100, (user_referrals * 100 / NULLIF(m.milestone_count, 0)))::INTEGER AS progress_percent
  FROM public.referral_milestones m
  LEFT JOIN public.user_milestone_progress ump ON m.id = ump.milestone_id AND ump.user_id = auth.uid()
  WHERE m.is_active = true
  ORDER BY m.milestone_count ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_campaign_leaderboard(p_campaign_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  rank INTEGER,
  user_id UUID,
  user_name TEXT,
  referrals INTEGER,
  points INTEGER,
  is_current_user BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROW_NUMBER() OVER (ORDER BY p.referrals_during_campaign DESC)::INTEGER AS rank,
    p.user_id,
    COALESCE(pr.full_name, 'Anonymous') AS user_name,
    p.referrals_during_campaign AS referrals,
    p.points_earned AS points,
    (p.user_id = auth.uid()) AS is_current_user
  FROM public.referral_campaign_participants p
  LEFT JOIN public.profiles pr ON p.user_id = pr.id
  WHERE p.campaign_id = p_campaign_id
  ORDER BY p.referrals_during_campaign DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_sponsor_pipeline_summary()
RETURNS TABLE (
  stage TEXT,
  count BIGINT,
  total_value NUMERIC,
  weighted_value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.pipeline_stage AS stage,
    COUNT(*) AS count,
    COALESCE(SUM(p.deal_value), 0) AS total_value,
    COALESCE(SUM(p.weighted_value), 0) AS weighted_value
  FROM public.sponsor_prospects p
  GROUP BY p.pipeline_stage
  ORDER BY 
    CASE p.pipeline_stage
      WHEN 'research' THEN 1
      WHEN 'outreach' THEN 2
      WHEN 'contacted' THEN 3
      WHEN 'meeting_scheduled' THEN 4
      WHEN 'meeting_completed' THEN 5
      WHEN 'proposal_sent' THEN 6
      WHEN 'negotiation' THEN 7
      WHEN 'closed_won' THEN 8
      WHEN 'closed_lost' THEN 9
      WHEN 'on_hold' THEN 10
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.track_prospect_stage_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.pipeline_stage IS DISTINCT FROM NEW.pipeline_stage THEN
    NEW.stage_changed_at = now();
    
    INSERT INTO public.sponsor_outreach_activities (
      prospect_id,
      activity_type,
      subject,
      body,
      is_completed,
      completed_at
    ) VALUES (
      NEW.id,
      'note',
      'Pipeline Stage Changed',
      format('Stage changed from %s to %s', OLD.pipeline_stage, NEW.pipeline_stage),
      true,
      now()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_campaign_participant_stats()
RETURNS TRIGGER AS $$
BEGIN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;