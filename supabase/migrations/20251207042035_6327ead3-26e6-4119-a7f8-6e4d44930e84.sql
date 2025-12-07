-- Add input validation to log_user_activity function
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id uuid, 
  p_activity_type text, 
  p_business_id uuid DEFAULT NULL::uuid, 
  p_activity_data jsonb DEFAULT '{}'::jsonb, 
  p_points_involved integer DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  activity_id UUID;
  v_sanitized_activity_type text;
  v_validated_activity_data jsonb;
BEGIN
  -- Validate user_id is a valid UUID
  IF NOT validate_uuid_input(p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id format';
  END IF;
  
  -- Validate business_id if provided
  IF p_business_id IS NOT NULL AND NOT validate_uuid_input(p_business_id) THEN
    RAISE EXCEPTION 'Invalid business_id format';
  END IF;
  
  -- Sanitize activity_type (max 100 chars, alphanumeric and underscores only)
  v_sanitized_activity_type := sanitize_text_input(p_activity_type, 100);
  IF v_sanitized_activity_type IS NULL OR v_sanitized_activity_type = '' THEN
    RAISE EXCEPTION 'activity_type is required';
  END IF;
  
  -- Validate activity_type format (only allow safe characters)
  IF v_sanitized_activity_type !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'activity_type contains invalid characters';
  END IF;
  
  -- Validate activity_data is valid JSONB and limit size
  IF p_activity_data IS NOT NULL THEN
    -- Check JSONB size (limit to 10KB to prevent abuse)
    IF length(p_activity_data::text) > 10240 THEN
      RAISE EXCEPTION 'activity_data exceeds maximum allowed size';
    END IF;
    v_validated_activity_data := p_activity_data;
  ELSE
    v_validated_activity_data := '{}'::jsonb;
  END IF;
  
  -- Validate points_involved is within reasonable range
  IF p_points_involved < -10000 OR p_points_involved > 10000 THEN
    RAISE EXCEPTION 'points_involved value out of valid range';
  END IF;

  INSERT INTO public.activity_log (
    user_id,
    business_id,
    activity_type,
    activity_data,
    points_involved
  ) VALUES (
    p_user_id,
    p_business_id,
    v_sanitized_activity_type,
    v_validated_activity_data,
    p_points_involved
  ) RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$function$;

-- Add input validation to record_business_metric function
CREATE OR REPLACE FUNCTION public.record_business_metric(
  p_business_id uuid, 
  p_metric_type character varying, 
  p_metric_value numeric, 
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  v_sanitized_metric_type varchar(100);
  v_validated_metadata jsonb;
BEGIN
  -- Validate business_id
  IF NOT validate_uuid_input(p_business_id) THEN
    RAISE EXCEPTION 'Invalid business_id format';
  END IF;
  
  -- Verify business exists
  IF NOT EXISTS (SELECT 1 FROM businesses WHERE id = p_business_id) THEN
    RAISE EXCEPTION 'Business not found';
  END IF;
  
  -- Sanitize metric_type (max 100 chars)
  v_sanitized_metric_type := sanitize_text_input(p_metric_type::text, 100);
  IF v_sanitized_metric_type IS NULL OR v_sanitized_metric_type = '' THEN
    RAISE EXCEPTION 'metric_type is required';
  END IF;
  
  -- Validate metric_type format (only allow safe characters)
  IF v_sanitized_metric_type !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'metric_type contains invalid characters';
  END IF;
  
  -- Validate metric_value is within reasonable range
  IF p_metric_value IS NULL THEN
    RAISE EXCEPTION 'metric_value is required';
  END IF;
  
  IF p_metric_value < -999999999 OR p_metric_value > 999999999 THEN
    RAISE EXCEPTION 'metric_value out of valid range';
  END IF;
  
  -- Validate metadata JSONB size
  IF p_metadata IS NOT NULL THEN
    IF length(p_metadata::text) > 10240 THEN
      RAISE EXCEPTION 'metadata exceeds maximum allowed size';
    END IF;
    v_validated_metadata := p_metadata;
  ELSE
    v_validated_metadata := '{}'::jsonb;
  END IF;

  INSERT INTO business_analytics (business_id, metric_type, metric_value, metadata)
  VALUES (p_business_id, v_sanitized_metric_type, p_metric_value, v_validated_metadata)
  ON CONFLICT (business_id, date_recorded, metric_type)
  DO UPDATE SET 
    metric_value = business_analytics.metric_value + EXCLUDED.metric_value,
    metadata = EXCLUDED.metadata;
END;
$function$;