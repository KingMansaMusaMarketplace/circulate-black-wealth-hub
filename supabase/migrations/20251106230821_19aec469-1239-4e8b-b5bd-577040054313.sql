-- Create user preferences table for AI recommendations
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_categories TEXT[] DEFAULT '{}',
  preferred_locations TEXT[] DEFAULT '{}',
  price_range TEXT DEFAULT 'moderate',
  distance_preference INTEGER DEFAULT 10,
  business_type_preference TEXT[] DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create recommendations table to cache AI suggestions
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  recommendation_score DECIMAL(3,2) NOT NULL,
  recommendation_reason TEXT,
  metadata JSONB DEFAULT '{}',
  shown_at TIMESTAMP WITH TIME ZONE,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours')
);

-- Create gamification tables
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_awarded INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_type TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, streak_type)
);

CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  metadata JSONB DEFAULT '{}',
  period TEXT DEFAULT 'all_time',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, category, period)
);

-- Create community finance tables
CREATE TABLE IF NOT EXISTS public.savings_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_name TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_amount DECIMAL(10,2) NOT NULL,
  contribution_amount DECIMAL(10,2) NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  max_members INTEGER DEFAULT 10,
  current_members INTEGER DEFAULT 1,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'active', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.savings_circle_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES savings_circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  total_contributed DECIMAL(10,2) DEFAULT 0,
  payout_position INTEGER,
  has_received_payout BOOLEAN DEFAULT false,
  payout_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'removed')),
  UNIQUE(circle_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.community_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goal_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  min_investment DECIMAL(10,2) DEFAULT 25,
  equity_offered DECIMAL(5,2),
  investor_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'funded', 'active', 'closed')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id UUID NOT NULL REFERENCES community_investments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  equity_percentage DECIMAL(5,4),
  invested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'returned', 'lost'))
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_recommendations
CREATE POLICY "Users can view own recommendations"
  ON public.ai_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON public.ai_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for gamification
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own streaks"
  ON public.user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view leaderboard"
  ON public.leaderboard FOR SELECT
  USING (true);

-- RLS Policies for savings circles
CREATE POLICY "Everyone can view open circles"
  ON public.savings_circles FOR SELECT
  USING (status = 'open' OR creator_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM savings_circle_members WHERE circle_id = id AND user_id = auth.uid()));

CREATE POLICY "Users can create circles"
  ON public.savings_circles FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their circles"
  ON public.savings_circles FOR UPDATE
  USING (auth.uid() = creator_id);

-- RLS Policies for circle members
CREATE POLICY "Members can view their circles"
  ON public.savings_circle_members FOR SELECT
  USING (auth.uid() = user_id OR 
         EXISTS (SELECT 1 FROM savings_circles WHERE id = circle_id AND creator_id = auth.uid()));

CREATE POLICY "Users can join circles"
  ON public.savings_circle_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for investments
CREATE POLICY "Everyone can view open investments"
  ON public.community_investments FOR SELECT
  USING (true);

CREATE POLICY "Business owners can create investments"
  ON public.community_investments FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND owner_id = auth.uid()));

CREATE POLICY "Users can view own investments"
  ON public.user_investments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create investments"
  ON public.user_investments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_recommendations_user ON public.ai_recommendations(user_id);
CREATE INDEX idx_recommendations_expires ON public.ai_recommendations(expires_at);
CREATE INDEX idx_achievements_user ON public.user_achievements(user_id);
CREATE INDEX idx_streaks_user ON public.user_streaks(user_id);
CREATE INDEX idx_leaderboard_category ON public.leaderboard(category, period, rank);
CREATE INDEX idx_savings_circles_status ON public.savings_circles(status);
CREATE INDEX idx_circle_members_circle ON public.savings_circle_members(circle_id);
CREATE INDEX idx_investments_business ON public.community_investments(business_id);
CREATE INDEX idx_user_investments_user ON public.user_investments(user_id);