-- Create secure functions to replace exec_sql usage

-- Function to handle API errors securely
CREATE OR REPLACE FUNCTION public.handle_api_error(
  operation_name TEXT,
  error_message TEXT,
  error_details JSONB DEFAULT '{}'::JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  error_ref TEXT;
  result JSONB;
BEGIN
  -- Generate a unique reference for this error
  error_ref := UPPER(SUBSTRING(REPLACE(CAST(gen_random_uuid() AS TEXT), '-', ''), 1, 8));
  
  -- Log the error to security_audit_log table
  INSERT INTO public.security_audit_log (
    action,
    table_name,
    user_id,
    user_agent,
    timestamp
  ) VALUES (
    'api_error_' || operation_name,
    'system_errors',
    auth.uid(),
    error_message || ' | Details: ' || error_details::TEXT,
    now()
  );
  
  -- Return structured response
  result := jsonb_build_object(
    'success', false,
    'error_reference', error_ref,
    'operation', operation_name,
    'logged_at', now()
  );
  
  RETURN result;
END;
$$;

-- Function to check rate limits securely
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  operation_name TEXT,
  limit_per_minute INTEGER DEFAULT 60
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_id UUID;
  recent_count INTEGER;
BEGIN
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RETURN false; -- Not authenticated
  END IF;
  
  -- Count recent activities for this user and operation
  SELECT COUNT(*) INTO recent_count
  FROM public.security_audit_log
  WHERE user_id = check_rate_limit.user_id
    AND action = 'rate_limit_' || operation_name
    AND timestamp > (now() - interval '1 minute');
  
  -- If under limit, log this check and allow
  IF recent_count < limit_per_minute THEN
    INSERT INTO public.security_audit_log (
      action,
      table_name,
      user_id,
      timestamp
    ) VALUES (
      'rate_limit_' || operation_name,
      'rate_limiting',
      user_id,
      now()
    );
    RETURN true;
  END IF;
  
  -- Over limit
  RETURN false;
END;
$$;

-- Function to log activities securely
CREATE OR REPLACE FUNCTION public.log_activity(
  activity_type TEXT,
  entity_type TEXT,
  entity_id TEXT,
  activity_details JSONB DEFAULT '{}'::JSONB
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    action,
    table_name,
    record_id,
    user_id,
    user_agent,
    timestamp
  ) VALUES (
    'activity_' || activity_type,
    entity_type,
    entity_id::UUID,
    auth.uid(),
    activity_details::TEXT,
    now()
  );
END;
$$;

-- Function to validate input securely
CREATE OR REPLACE FUNCTION public.validate_input(
  input_data JSONB,
  schema_name TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result JSONB;
  errors JSONB := '[]'::JSONB;
BEGIN
  -- Basic validation logic (can be extended based on schema_name)
  CASE schema_name
    WHEN 'business_profile' THEN
      -- Validate business profile data
      IF NOT (input_data ? 'business_name') OR (input_data->>'business_name') = '' THEN
        errors := errors || '{"field": "business_name", "message": "Business name is required"}'::JSONB;
      END IF;
      
      IF NOT (input_data ? 'email') OR (input_data->>'email') = '' THEN
        errors := errors || '{"field": "email", "message": "Email is required"}'::JSONB;
      END IF;
      
    WHEN 'user_profile' THEN
      -- Validate user profile data
      IF NOT (input_data ? 'full_name') OR (input_data->>'full_name') = '' THEN
        errors := errors || '{"field": "full_name", "message": "Full name is required"}'::JSONB;
      END IF;
      
    ELSE
      -- Default validation - just check if data is not empty
      IF input_data = '{}'::JSONB THEN
        errors := errors || '{"field": "general", "message": "No data provided"}'::JSONB;
      END IF;
  END CASE;
  
  -- Build result
  result := jsonb_build_object(
    'valid', jsonb_array_length(errors) = 0,
    'errors', errors
  );
  
  RETURN result;
END;
$$;

-- Function to check if database functions exist (for initialization check)
CREATE OR REPLACE FUNCTION public.check_function_exists(function_name TEXT) 
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = function_name 
    AND pronamespace = 'public'::regnamespace
  );
$$;