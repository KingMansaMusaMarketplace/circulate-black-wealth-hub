-- Fix RLS policies to allow proper data access
-- Issue: Users can't see business owner profiles, blocking dashboard functionality

-- ============================================================================
-- FIX PROFILE VISIBILITY
-- ============================================================================

-- Drop the overly restrictive policy
DROP POLICY IF EXISTS "Users can view only their own profile" ON profiles;

-- Create a new policy that allows viewing public profile info
CREATE POLICY "Users can view all profiles basic info"
  ON profiles FOR SELECT
  USING (true);

-- Keep the existing update policy (users can only update their own profile)
-- This policy already exists: "Users can update their own basic profile data secure"

-- ============================================================================
-- ENSURE PROFILE INSERT POLICY EXISTS
-- ============================================================================

-- Check if users can create their own profiles
-- This is needed when business signup tries to create a profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can insert their own profile'
    AND cmd = 'INSERT'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
      ON profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- ============================================================================
-- FIX BUSINESS POLICIES FOR PROPER ACCESS
-- ============================================================================

-- The existing "Owners manage businesses" policy should work for INSERT
-- But let's verify the public read access is clear

-- Drop and recreate the public view policy to be more explicit
DROP POLICY IF EXISTS "Public can view business directory" ON businesses;

CREATE POLICY "Public can view businesses"
  ON businesses FOR SELECT
  USING (true);

-- The "Owners manage businesses" policy already handles INSERT/UPDATE/DELETE
-- with the check: (auth.uid() = owner_id) OR (auth.uid() = location_manager_id)