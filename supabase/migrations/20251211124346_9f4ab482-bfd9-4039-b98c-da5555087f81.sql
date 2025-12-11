-- Fix 1: Create secure function for public profile info (for leaderboards/activity feeds)
CREATE OR REPLACE FUNCTION public.get_public_profile_info(user_ids uuid[])
RETURNS TABLE(id uuid, display_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT p.id, p.full_name as display_name, p.avatar_url
  FROM profiles p
  WHERE p.id = ANY(user_ids);
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_profile_info(uuid[]) TO authenticated;

-- Fix 2: Drop unprotected views that have secure alternatives
DROP VIEW IF EXISTS public.business_directory_public;
DROP VIEW IF EXISTS public.business_locations_view;