-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_business_id UUID DEFAULT NULL,
  p_activity_data JSONB DEFAULT '{}',
  p_points_involved INTEGER DEFAULT 0
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.activity_log (
    user_id,
    business_id,
    activity_type,
    activity_data,
    points_involved
  ) VALUES (
    p_user_id,
    p_business_id,
    p_activity_type,
    p_activity_data,
    p_points_involved
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;