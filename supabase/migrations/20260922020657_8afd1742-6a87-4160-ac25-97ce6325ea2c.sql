-- Realtime: exact topic ownership match instead of wildcard prefix
DROP POLICY IF EXISTS "Users receive own data channels only" ON realtime.messages;
CREATE POLICY "Users receive own data channels only"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  split_part(realtime.topic(), ':', 1) = (auth.uid())::text
  OR split_part(realtime.topic(), '-', 1) = (auth.uid())::text
  OR realtime.topic() = (auth.uid())::text
  OR realtime.topic() = 'community_wealth_stats'
  OR public.is_admin_secure()
);

-- Susu circles: only circles still forming are browsable; running circles are members-only
DROP POLICY IF EXISTS "Authenticated users can view active susu circles" ON public.susu_circles;

CREATE POLICY "Anyone signed in can browse forming circles"
ON public.susu_circles
FOR SELECT
TO authenticated
USING (status = 'forming');

CREATE POLICY "Members can view their circles"
ON public.susu_circles
FOR SELECT
TO authenticated
USING (
  auth.uid() = creator_id
  OR EXISTS (
    SELECT 1 FROM public.susu_memberships m
    WHERE m.circle_id = susu_circles.id
      AND m.user_id = auth.uid()
  )
);