-- Create group challenges table
CREATE TABLE IF NOT EXISTS group_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('spending', 'visits', 'reviews', 'referrals')),
  goal_value NUMERIC NOT NULL,
  current_value NUMERIC DEFAULT 0,
  reward_points INTEGER NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  participant_count INTEGER DEFAULT 0,
  max_participants INTEGER,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create challenge participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES group_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contribution_value NUMERIC DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Create challenge activities table (track individual contributions)
CREATE TABLE IF NOT EXISTS challenge_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES group_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_group_challenges_status ON group_challenges(status, end_date);
CREATE INDEX idx_challenge_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX idx_challenge_participants_user ON challenge_participants(user_id);
CREATE INDEX idx_challenge_activities_challenge ON challenge_activities(challenge_id);
CREATE INDEX idx_challenge_activities_user ON challenge_activities(user_id);

-- Enable RLS
ALTER TABLE group_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for group_challenges
CREATE POLICY "Anyone can view active challenges"
  ON group_challenges FOR SELECT
  USING (status = 'active' AND end_date > now());

CREATE POLICY "Authenticated users can create challenges"
  ON group_challenges FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Challenge creators can update their challenges"
  ON group_challenges FOR UPDATE
  USING (auth.uid() = created_by);

-- RLS Policies for challenge_participants
CREATE POLICY "Anyone can view participants"
  ON challenge_participants FOR SELECT
  USING (true);

CREATE POLICY "Users can join challenges"
  ON challenge_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation"
  ON challenge_participants FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for challenge_activities
CREATE POLICY "Users can view challenge activities"
  ON challenge_activities FOR SELECT
  USING (true);

CREATE POLICY "System can create challenge activities"
  ON challenge_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to join a challenge
CREATE OR REPLACE FUNCTION join_challenge(p_challenge_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_challenge RECORD;
  v_result jsonb;
BEGIN
  -- Get challenge details
  SELECT * INTO v_challenge
  FROM group_challenges
  WHERE id = p_challenge_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Challenge not found');
  END IF;
  
  -- Check if challenge is active
  IF v_challenge.status != 'active' OR v_challenge.end_date < now() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Challenge is not active');
  END IF;
  
  -- Check if max participants reached
  IF v_challenge.max_participants IS NOT NULL AND 
     v_challenge.participant_count >= v_challenge.max_participants THEN
    RETURN jsonb_build_object('success', false, 'error', 'Challenge is full');
  END IF;
  
  -- Insert participant
  INSERT INTO challenge_participants (challenge_id, user_id)
  VALUES (p_challenge_id, auth.uid())
  ON CONFLICT (challenge_id, user_id) DO NOTHING;
  
  -- Update participant count
  UPDATE group_challenges
  SET participant_count = participant_count + 1
  WHERE id = p_challenge_id;
  
  v_result := jsonb_build_object(
    'success', true,
    'message', 'Successfully joined challenge'
  );
  
  RETURN v_result;
END;
$$;

-- Function to record challenge activity
CREATE OR REPLACE FUNCTION record_challenge_activity(
  p_challenge_id UUID,
  p_activity_type TEXT,
  p_activity_value NUMERIC,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert activity
  INSERT INTO challenge_activities (challenge_id, user_id, activity_type, activity_value, metadata)
  VALUES (p_challenge_id, auth.uid(), p_activity_type, p_activity_value, p_metadata);
  
  -- Update participant contribution
  UPDATE challenge_participants
  SET contribution_value = contribution_value + p_activity_value
  WHERE challenge_id = p_challenge_id AND user_id = auth.uid();
  
  -- Update challenge current value
  UPDATE group_challenges
  SET current_value = current_value + p_activity_value
  WHERE id = p_challenge_id;
  
  -- Check if challenge is completed
  UPDATE group_challenges
  SET status = 'completed'
  WHERE id = p_challenge_id 
    AND current_value >= goal_value
    AND status = 'active';
END;
$$;

-- Trigger to auto-expire challenges
CREATE OR REPLACE FUNCTION expire_challenges()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE group_challenges
  SET status = 'expired'
  WHERE status = 'active' AND end_date < now();
END;
$$;