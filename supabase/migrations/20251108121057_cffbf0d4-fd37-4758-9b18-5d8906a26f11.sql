-- Create badge categories enum
CREATE TYPE badge_category AS ENUM ('referrals', 'earnings', 'recruitment', 'special');

-- Create badge tiers enum
CREATE TYPE badge_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');

-- Create badges definition table
CREATE TABLE IF NOT EXISTS public.agent_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category badge_category NOT NULL,
  tier badge_tier NOT NULL,
  icon_name TEXT NOT NULL,
  threshold_value INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user earned badges table
CREATE TABLE IF NOT EXISTS public.agent_earned_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_agent_id UUID NOT NULL REFERENCES public.sales_agents(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.agent_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  progress INTEGER DEFAULT 0,
  UNIQUE(sales_agent_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.agent_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_earned_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for badges (public read)
CREATE POLICY "Badges are viewable by everyone"
  ON public.agent_badges FOR SELECT
  USING (is_active = true);

-- RLS Policies for earned badges
CREATE POLICY "Users can view their own earned badges"
  ON public.agent_earned_badges FOR SELECT
  USING (
    sales_agent_id IN (
      SELECT id FROM public.sales_agents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all earned badges"
  ON public.agent_earned_badges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert default badges
INSERT INTO public.agent_badges (name, description, category, tier, icon_name, threshold_value, points) VALUES
  -- Referral milestones
  ('First Referral', 'Made your first successful referral', 'referrals', 'bronze', 'Star', 1, 10),
  ('Rising Star', 'Achieved 5 successful referrals', 'referrals', 'bronze', 'TrendingUp', 5, 25),
  ('Growth Champion', 'Achieved 10 successful referrals', 'referrals', 'silver', 'Award', 10, 50),
  ('Sales Pro', 'Achieved 25 successful referrals', 'referrals', 'gold', 'Trophy', 25, 100),
  ('Elite Performer', 'Achieved 50 successful referrals', 'referrals', 'platinum', 'Crown', 50, 250),
  ('Legend', 'Achieved 100 successful referrals', 'referrals', 'diamond', 'Gem', 100, 500),
  
  -- Earnings milestones
  ('First Commission', 'Earned your first commission', 'earnings', 'bronze', 'DollarSign', 1, 10),
  ('Money Maker', 'Earned $1,000 in commissions', 'earnings', 'silver', 'Coins', 1000, 50),
  ('High Earner', 'Earned $5,000 in commissions', 'earnings', 'gold', 'Banknote', 5000, 100),
  ('Top Earner', 'Earned $10,000 in commissions', 'earnings', 'platinum', 'Wallet', 10000, 250),
  ('Wealth Builder', 'Earned $25,000 in commissions', 'earnings', 'diamond', 'PiggyBank', 25000, 500),
  
  -- Recruitment milestones
  ('Team Builder', 'Recruited your first agent', 'recruitment', 'bronze', 'Users', 1, 25),
  ('Team Leader', 'Recruited 3 agents', 'recruitment', 'silver', 'UserPlus', 3, 75),
  ('Talent Scout', 'Recruited 5 agents', 'recruitment', 'gold', 'UsersRound', 5, 150),
  ('Master Recruiter', 'Recruited 10 agents', 'recruitment', 'platinum', 'Network', 10, 300),
  
  -- Special achievements
  ('Early Adopter', 'One of the first 100 agents', 'special', 'gold', 'Rocket', 0, 100),
  ('Streak Master', 'Active for 6 consecutive months', 'special', 'platinum', 'Flame', 6, 200);

-- Function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_sales_agent_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_referrals INTEGER;
  v_total_earned NUMERIC;
  v_recruited_count INTEGER;
  v_badge RECORD;
BEGIN
  -- Get agent stats
  SELECT 
    COALESCE(COUNT(DISTINCT r.id), 0),
    COALESCE(SUM(r.commission_amount), 0)
  INTO v_total_referrals, v_total_earned
  FROM public.referrals r
  WHERE r.sales_agent_id = p_sales_agent_id
    AND r.commission_status = 'paid';
  
  -- Get recruitment count
  SELECT COUNT(*) INTO v_recruited_count
  FROM public.sales_agents
  WHERE recruited_by_agent_id = p_sales_agent_id;
  
  -- Check referral badges
  FOR v_badge IN 
    SELECT * FROM public.agent_badges 
    WHERE category = 'referrals' AND is_active = true
  LOOP
    IF v_total_referrals >= v_badge.threshold_value THEN
      INSERT INTO public.agent_earned_badges (sales_agent_id, badge_id, progress)
      VALUES (p_sales_agent_id, v_badge.id, v_total_referrals)
      ON CONFLICT (sales_agent_id, badge_id) 
      DO UPDATE SET progress = v_total_referrals;
    END IF;
  END LOOP;
  
  -- Check earnings badges
  FOR v_badge IN 
    SELECT * FROM public.agent_badges 
    WHERE category = 'earnings' AND is_active = true
  LOOP
    IF v_total_earned >= v_badge.threshold_value THEN
      INSERT INTO public.agent_earned_badges (sales_agent_id, badge_id, progress)
      VALUES (p_sales_agent_id, v_badge.id, v_total_earned)
      ON CONFLICT (sales_agent_id, badge_id) 
      DO UPDATE SET progress = v_total_earned;
    END IF;
  END LOOP;
  
  -- Check recruitment badges
  FOR v_badge IN 
    SELECT * FROM public.agent_badges 
    WHERE category = 'recruitment' AND is_active = true
  LOOP
    IF v_recruited_count >= v_badge.threshold_value THEN
      INSERT INTO public.agent_earned_badges (sales_agent_id, badge_id, progress)
      VALUES (p_sales_agent_id, v_badge.id, v_recruited_count)
      ON CONFLICT (sales_agent_id, badge_id) 
      DO UPDATE SET progress = v_recruited_count;
    END IF;
  END LOOP;
END;
$$;

-- Function to get agent badges with progress
CREATE OR REPLACE FUNCTION public.get_agent_badges_with_progress(p_sales_agent_id UUID)
RETURNS TABLE (
  badge_id UUID,
  name TEXT,
  description TEXT,
  category badge_category,
  tier badge_tier,
  icon_name TEXT,
  threshold_value INTEGER,
  points INTEGER,
  is_earned BOOLEAN,
  earned_at TIMESTAMPTZ,
  progress INTEGER,
  progress_percentage INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.description,
    b.category,
    b.tier,
    b.icon_name,
    b.threshold_value,
    b.points,
    (eb.id IS NOT NULL) as is_earned,
    eb.earned_at,
    COALESCE(eb.progress, 0) as progress,
    CASE 
      WHEN b.threshold_value > 0 THEN 
        LEAST(100, (COALESCE(eb.progress, 0) * 100 / b.threshold_value))
      ELSE 0
    END as progress_percentage
  FROM public.agent_badges b
  LEFT JOIN public.agent_earned_badges eb 
    ON b.id = eb.badge_id AND eb.sales_agent_id = p_sales_agent_id
  WHERE b.is_active = true
  ORDER BY b.category, b.threshold_value;
END;
$$;