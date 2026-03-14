
-- Fix 2 was partially applied, need to recreate the profile update policy without 'role' column

DROP POLICY IF EXISTS "Users can update their own basic profile data secure" ON profiles;

CREATE POLICY "Users can update their own basic profile data secure"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND user_type IS NOT DISTINCT FROM (SELECT p.user_type FROM profiles p WHERE p.id = auth.uid())
);
