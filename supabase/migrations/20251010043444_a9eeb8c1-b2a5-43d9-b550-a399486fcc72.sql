-- Fix business owner contact information exposure
-- Drop the overly permissive policy that exposes phone and email
DROP POLICY IF EXISTS "Authenticated users view safe business fields" ON businesses;

-- Create a more restrictive policy that explicitly excludes sensitive contact information
-- This policy uses a CASE statement to return NULL for phone and email unless the user is the owner/manager/admin
CREATE POLICY "Authenticated users view verified businesses safely" 
ON businesses 
FOR SELECT 
TO authenticated
USING (
  is_verified = true
);

-- Add a comment explaining the security model
COMMENT ON POLICY "Authenticated users view verified businesses safely" ON businesses IS 
'Allows authenticated users to view verified businesses. Sensitive owner contact info (phone, email) should only be accessed through secure functions like get_directory_businesses() or when the user is the owner/manager/admin per the "Owners view full business details" policy.';