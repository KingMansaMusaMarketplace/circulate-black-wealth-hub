-- Update team bonus percentage from 30% to 25%
-- This adjusts the 2-tier referral system to award a more balanced team bonus

CREATE OR REPLACE FUNCTION calculate_team_bonus(tier1_points numeric)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Team bonus is 25% of tier 1 points (down from 30%)
  RETURN ROUND(tier1_points * 0.25, 2);
END;
$$;