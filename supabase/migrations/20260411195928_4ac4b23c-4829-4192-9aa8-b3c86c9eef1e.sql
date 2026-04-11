
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can check beta status by email" ON public.beta_testers;

-- Authenticated users can only read their own beta tester record
CREATE POLICY "Users can view own beta tester record"
ON public.beta_testers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin_secure());

-- Authenticated users can update their own record (for session tracking)
-- Keep existing admin policies as-is
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'beta_testers' 
    AND policyname = 'Users can update own beta tester record'
  ) THEN
    CREATE POLICY "Users can update own beta tester record"
    ON public.beta_testers
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
