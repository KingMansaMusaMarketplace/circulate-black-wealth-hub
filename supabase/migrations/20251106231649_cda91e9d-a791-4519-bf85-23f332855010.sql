-- Create function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak(
  p_user_id UUID,
  p_streak_type TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_activity DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  -- Get the current streak data
  SELECT 
    last_activity_date::DATE,
    current_streak,
    longest_streak
  INTO 
    v_last_activity,
    v_current_streak,
    v_longest_streak
  FROM user_streaks
  WHERE user_id = p_user_id AND streak_type = p_streak_type;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, streak_type, current_streak, longest_streak, last_activity_date)
    VALUES (p_user_id, p_streak_type, 1, 1, CURRENT_DATE);
    RETURN;
  END IF;
  
  -- Calculate streak continuation
  IF v_last_activity = CURRENT_DATE THEN
    -- Same day, no change
    RETURN;
  ELSIF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    v_current_streak := v_current_streak + 1;
    v_longest_streak := GREATEST(v_longest_streak, v_current_streak);
  ELSE
    -- Streak broken, reset to 1
    v_current_streak := 1;
  END IF;
  
  -- Update the streak
  UPDATE user_streaks
  SET 
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_activity_date = CURRENT_DATE
  WHERE user_id = p_user_id AND streak_type = p_streak_type;
END;
$$;