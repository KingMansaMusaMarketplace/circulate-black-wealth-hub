-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_group_challenges_status;
DROP INDEX IF EXISTS idx_challenge_participants_challenge;
DROP INDEX IF EXISTS idx_challenge_participants_user;
DROP INDEX IF EXISTS idx_challenge_activities_challenge;
DROP INDEX IF EXISTS idx_challenge_activities_user;

-- Create indexes
CREATE INDEX idx_group_challenges_status ON group_challenges(status, end_date);
CREATE INDEX idx_challenge_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX idx_challenge_participants_user ON challenge_participants(user_id);
CREATE INDEX idx_challenge_activities_challenge ON challenge_activities(challenge_id);
CREATE INDEX idx_challenge_activities_user ON challenge_activities(user_id);