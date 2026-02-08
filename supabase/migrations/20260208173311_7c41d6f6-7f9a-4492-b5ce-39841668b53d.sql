-- Fix RLS policy to allow all users to see active properties
-- The current policy only lets authenticated users see their own properties

-- Drop the restrictive host-only view policy
DROP POLICY IF EXISTS "Hosts can view their own properties" ON vacation_properties;

-- Update the public SELECT policy to also work for authenticated users
-- (The existing "Anyone can view active properties" policy with public role should already cover this,
-- but we need to ensure authenticated users can also read all active properties)
DROP POLICY IF EXISTS "Anyone can view active properties" ON vacation_properties;

-- Create a single SELECT policy that allows everyone to see active properties
CREATE POLICY "Anyone can view active properties" 
ON vacation_properties 
FOR SELECT 
USING (is_active = true);

-- Also allow hosts to see their own properties even if inactive (for management)
CREATE POLICY "Hosts can view all their own properties" 
ON vacation_properties 
FOR SELECT 
TO authenticated
USING (host_id = auth.uid());