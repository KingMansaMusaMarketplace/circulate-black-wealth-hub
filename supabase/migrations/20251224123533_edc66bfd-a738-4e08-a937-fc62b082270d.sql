-- Create table for AI assistant rate limiting (persistent across cold starts)
CREATE TABLE IF NOT EXISTS public.ai_assistant_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_rate_limit UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.ai_assistant_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create RPC function for rate limiting check (20 requests per minute per user)
CREATE OR REPLACE FUNCTION public.check_ai_assistant_rate_limit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_request_count INTEGER;
  v_max_requests INTEGER := 20;  -- Max requests per window
  v_window_duration INTERVAL := '1 minute';  -- Time window
BEGIN
  -- Get current rate limit record
  SELECT window_start, request_count 
  INTO v_window_start, v_request_count
  FROM ai_assistant_rate_limits 
  WHERE user_id = p_user_id;
  
  -- If no record exists or window has expired, create/reset
  IF NOT FOUND OR (now() - v_window_start) > v_window_duration THEN
    INSERT INTO ai_assistant_rate_limits (user_id, request_count, window_start, updated_at)
    VALUES (p_user_id, 1, now(), now())
    ON CONFLICT (user_id) 
    DO UPDATE SET request_count = 1, window_start = now(), updated_at = now();
    
    RETURN TRUE;
  END IF;
  
  -- Check if limit exceeded
  IF v_request_count >= v_max_requests THEN
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  UPDATE ai_assistant_rate_limits 
  SET request_count = request_count + 1, updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_ai_assistant_rate_limit(UUID) TO authenticated;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_ai_rate_limits_user_id ON public.ai_assistant_rate_limits(user_id);

-- Add policy for internal access only (no direct user access)
CREATE POLICY "System access only" ON public.ai_assistant_rate_limits
  FOR ALL USING (false);