-- Create a function to get public platform stats
-- This uses SECURITY DEFINER to bypass RLS for counting public stats
CREATE OR REPLACE FUNCTION public.get_platform_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_members', (SELECT COUNT(*) FROM profiles),
    'total_businesses', (SELECT COUNT(*) FROM businesses WHERE is_verified = true),
    'total_transactions', (SELECT COUNT(*) FROM transactions),
    'total_value', COALESCE((SELECT SUM(amount) FROM transactions), 0)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_platform_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.get_platform_stats() TO authenticated;