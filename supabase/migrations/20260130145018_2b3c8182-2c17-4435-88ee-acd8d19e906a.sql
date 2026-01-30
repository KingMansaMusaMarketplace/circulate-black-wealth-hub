-- Fix the ambiguous column reference in check_rate_limit_secure function
-- The issue is that variable names (attempt_count, window_start) conflict with table column names

CREATE OR REPLACE FUNCTION public.check_rate_limit_secure(operation_name text, max_attempts integer DEFAULT 5, window_minutes integer DEFAULT 15)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_current_user_id UUID;
    v_window_start TIMESTAMP WITH TIME ZONE;
    v_attempt_count INTEGER;
    v_result JSONB;
BEGIN
    v_current_user_id := auth.uid();
    v_window_start := now() - (window_minutes || ' minutes')::INTERVAL;
    
    -- Check current attempts in the time window
    -- Using table-qualified column names to avoid ambiguity
    SELECT COALESCE(SUM(rate_limit_log.attempt_count), 0) INTO v_attempt_count
    FROM public.rate_limit_log
    WHERE rate_limit_log.user_id = v_current_user_id
        AND rate_limit_log.operation = operation_name
        AND rate_limit_log.window_start >= v_window_start
        AND (rate_limit_log.blocked_until IS NULL OR rate_limit_log.blocked_until < now());
    
    IF v_attempt_count >= max_attempts THEN
        -- Block for additional time
        INSERT INTO public.rate_limit_log (
            user_id, operation, attempt_count, blocked_until
        ) VALUES (
            v_current_user_id, operation_name, 1, 
            now() + (window_minutes * 2 || ' minutes')::INTERVAL
        );
        
        v_result := jsonb_build_object(
            'allowed', false,
            'attempts_remaining', 0,
            'blocked_until', now() + (window_minutes * 2 || ' minutes')::INTERVAL,
            'message', 'Rate limit exceeded. Access temporarily blocked.'
        );
    ELSE
        -- Log this attempt
        INSERT INTO public.rate_limit_log (
            user_id, operation, attempt_count
        ) VALUES (
            v_current_user_id, operation_name, 1
        );
        
        v_result := jsonb_build_object(
            'allowed', true,
            'attempts_remaining', max_attempts - v_attempt_count - 1,
            'message', 'Access allowed'
        );
    END IF;
    
    RETURN v_result;
END;
$function$;