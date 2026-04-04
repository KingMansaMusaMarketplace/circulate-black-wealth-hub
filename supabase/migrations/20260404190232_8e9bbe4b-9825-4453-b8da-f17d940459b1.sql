
-- Server-side auth rate limiting table
CREATE TABLE IF NOT EXISTS public.auth_rate_limits_v2 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- email or hashed IP
  attempt_type text NOT NULL DEFAULT 'login', -- login, password_reset, signup
  attempt_count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_auth_rate_limits_v2_identifier 
  ON public.auth_rate_limits_v2 (identifier, attempt_type, window_start);

-- Enable RLS but NO user-facing policies (server-side only via service_role)
ALTER TABLE public.auth_rate_limits_v2 ENABLE ROW LEVEL SECURITY;

-- Server-side rate limit check function
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit_v2(
  p_identifier text,
  p_attempt_type text DEFAULT 'login',
  p_max_attempts integer DEFAULT 5,
  p_window_minutes integer DEFAULT 15
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record auth_rate_limits_v2%ROWTYPE;
  v_window_start timestamptz;
  v_now timestamptz := now();
  v_is_allowed boolean := true;
  v_remaining integer;
  v_blocked_until timestamptz;
BEGIN
  v_window_start := v_now - (p_window_minutes || ' minutes')::interval;
  
  -- Check if currently blocked
  SELECT * INTO v_record
  FROM auth_rate_limits_v2
  WHERE identifier = p_identifier
    AND attempt_type = p_attempt_type
    AND window_start > v_window_start
  ORDER BY window_start DESC
  LIMIT 1;
  
  IF v_record IS NOT NULL THEN
    -- Check if blocked
    IF v_record.blocked_until IS NOT NULL AND v_record.blocked_until > v_now THEN
      RETURN jsonb_build_object(
        'allowed', false,
        'remaining_attempts', 0,
        'blocked_until', v_record.blocked_until,
        'retry_after_seconds', EXTRACT(EPOCH FROM (v_record.blocked_until - v_now))::integer
      );
    END IF;
    
    -- Check attempt count
    IF v_record.attempt_count >= p_max_attempts THEN
      -- Block the identifier
      v_blocked_until := v_now + (p_window_minutes || ' minutes')::interval;
      
      UPDATE auth_rate_limits_v2
      SET blocked_until = v_blocked_until, updated_at = v_now
      WHERE id = v_record.id;
      
      RETURN jsonb_build_object(
        'allowed', false,
        'remaining_attempts', 0,
        'blocked_until', v_blocked_until,
        'retry_after_seconds', (p_window_minutes * 60)
      );
    END IF;
    
    -- Increment count
    UPDATE auth_rate_limits_v2
    SET attempt_count = attempt_count + 1, updated_at = v_now
    WHERE id = v_record.id;
    
    v_remaining := p_max_attempts - (v_record.attempt_count + 1);
  ELSE
    -- First attempt in window - create record
    INSERT INTO auth_rate_limits_v2 (identifier, attempt_type, attempt_count, window_start)
    VALUES (p_identifier, p_attempt_type, 1, v_now);
    
    v_remaining := p_max_attempts - 1;
  END IF;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'remaining_attempts', GREATEST(v_remaining, 0),
    'blocked_until', null,
    'retry_after_seconds', 0
  );
END;
$$;

-- Cleanup function to purge old rate limit records (run via cron)
CREATE OR REPLACE FUNCTION public.cleanup_auth_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth_rate_limits_v2
  WHERE window_start < now() - interval '1 hour';
END;
$$;

-- Reset rate limit on successful auth (call after successful login)
CREATE OR REPLACE FUNCTION public.reset_auth_rate_limit(
  p_identifier text,
  p_attempt_type text DEFAULT 'login'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth_rate_limits_v2
  WHERE identifier = p_identifier
    AND attempt_type = p_attempt_type;
END;
$$;
