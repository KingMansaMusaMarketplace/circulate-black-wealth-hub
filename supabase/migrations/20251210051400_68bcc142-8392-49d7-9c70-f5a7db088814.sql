-- Create referral_tiers table
CREATE TABLE public.referral_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name text NOT NULL UNIQUE,
  min_referrals integer NOT NULL DEFAULT 0,
  max_referrals integer,
  points_per_referral integer NOT NULL DEFAULT 100,
  cash_bonus numeric NOT NULL DEFAULT 0,
  tier_color text DEFAULT '#CD7F32',
  special_perks jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create referral_stats table
CREATE TABLE public.referral_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_referrals integer DEFAULT 0,
  successful_referrals integer DEFAULT 0,
  pending_referrals integer DEFAULT 0,
  total_points_earned integer DEFAULT 0,
  total_cash_earned numeric DEFAULT 0,
  current_tier text DEFAULT 'Bronze',
  rank integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_referrals table (separate from sales agent referrals)
CREATE TABLE public.user_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_email text,
  referral_code text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'rewarded', 'expired')),
  points_awarded integer DEFAULT 0,
  cash_awarded numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  converted_at timestamp with time zone
);

-- Create referral_rewards table
CREATE TABLE public.referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_id uuid REFERENCES public.user_referrals(id) ON DELETE SET NULL,
  reward_type text NOT NULL CHECK (reward_type IN ('points', 'cash', 'badge', 'perk')),
  reward_value numeric NOT NULL DEFAULT 0,
  reward_description text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'expired')),
  expires_at timestamp with time zone DEFAULT (now() + interval '30 days'),
  claimed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.referral_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_tiers (public read)
CREATE POLICY "Anyone can view referral tiers" ON public.referral_tiers
  FOR SELECT USING (true);

-- RLS Policies for referral_stats
CREATE POLICY "Users can view their own stats" ON public.referral_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" ON public.referral_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON public.referral_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Leaderboard is public" ON public.referral_stats
  FOR SELECT USING (true);

-- RLS Policies for user_referrals
CREATE POLICY "Users can view their own referrals" ON public.user_referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals" ON public.user_referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can update their own referrals" ON public.user_referrals
  FOR UPDATE USING (auth.uid() = referrer_id);

-- RLS Policies for referral_rewards
CREATE POLICY "Users can view their own rewards" ON public.referral_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards" ON public.referral_rewards
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert default tiers
INSERT INTO public.referral_tiers (tier_name, min_referrals, max_referrals, points_per_referral, cash_bonus, tier_color, special_perks) VALUES
  ('Bronze', 0, 4, 100, 0, '#CD7F32', '["Early access to new features"]'),
  ('Silver', 5, 14, 150, 5, '#C0C0C0', '["Early access to new features", "Priority support"]'),
  ('Gold', 15, 29, 200, 10, '#FFD700', '["Early access to new features", "Priority support", "Exclusive deals"]'),
  ('Platinum', 30, 49, 300, 20, '#E5E4E2', '["Early access to new features", "Priority support", "Exclusive deals", "VIP events access"]'),
  ('Diamond', 50, NULL, 500, 50, '#B9F2FF', '["All perks", "Personal account manager", "Custom rewards"]');

-- Create function to get or create user referral code
CREATE OR REPLACE FUNCTION public.create_user_referral(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral_code text;
  v_existing_code text;
BEGIN
  -- Check if user already has a referral code in profiles
  SELECT referral_code INTO v_existing_code
  FROM profiles
  WHERE id = p_user_id;
  
  IF v_existing_code IS NOT NULL AND v_existing_code != '' THEN
    RETURN v_existing_code;
  END IF;
  
  -- Generate new code
  v_referral_code := upper(substr(md5(random()::text || p_user_id::text), 1, 8));
  
  -- Update profile with new code
  UPDATE profiles
  SET referral_code = v_referral_code
  WHERE id = p_user_id;
  
  -- Create initial stats record
  INSERT INTO referral_stats (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN v_referral_code;
END;
$$;