
DROP POLICY IF EXISTS "Users receive own data channels only" ON realtime.messages;

CREATE POLICY "Users receive own data channels only"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() LIKE ((auth.uid())::text || ':%')
  OR realtime.topic() LIKE ((auth.uid())::text || '-%')
  OR realtime.topic() = (auth.uid())::text
  OR realtime.topic() = 'community_wealth_stats'
  OR is_admin_secure()
);
