-- Security Fix 1: Add input validation for SECURITY DEFINER functions

-- Helper function to validate UUID format
CREATE OR REPLACE FUNCTION public.validate_uuid_input(input_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN input_uuid IS NOT NULL;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Helper function to validate and sanitize text inputs (max 500 chars for audit fields)
CREATE OR REPLACE FUNCTION public.sanitize_text_input(input_text text, max_length integer DEFAULT 500)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Trim and limit length
  RETURN substring(trim(input_text), 1, max_length);
END;
$$;

-- Update get_application_personal_data_secure with input validation
CREATE OR REPLACE FUNCTION public.get_application_personal_data_secure(p_application_id uuid)
RETURNS TABLE(application_id uuid, decrypted_full_name text, decrypted_email text, decrypted_phone text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  personal_data RECORD;
BEGIN
  -- Validate UUID input
  IF NOT public.validate_uuid_input(p_application_id) THEN
    RAISE EXCEPTION 'Invalid application ID format';
  END IF;

  -- Only allow admins to access this function
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required to access personal data.';
  END IF;
  
  -- Rate limiting check
  IF NOT public.check_rate_limit('personal_data_access', 10) THEN
    RAISE EXCEPTION 'Rate limit exceeded for personal data access.';
  END IF;
  
  -- Get the encrypted data
  SELECT * INTO personal_data 
  FROM public.sales_agent_applications_personal_data 
  WHERE application_id = p_application_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Log the access for audit purposes
  INSERT INTO public.security_audit_log (
    action,
    table_name,
    record_id,
    user_id,
    timestamp
  ) VALUES (
    'personal_data_access',
    'sales_agent_applications_personal_data',
    personal_data.id,
    auth.uid(),
    now()
  );
  
  -- Update last accessed tracking
  UPDATE public.sales_agent_applications_personal_data
  SET 
    last_accessed_at = now(),
    last_accessed_by = auth.uid()
  WHERE id = personal_data.id;
  
  RETURN QUERY SELECT 
    personal_data.application_id,
    personal_data.encrypted_full_name,
    personal_data.encrypted_email,
    personal_data.encrypted_phone;
END;
$function$;

-- Update create_sales_agent_application_secure with better validation
CREATE OR REPLACE FUNCTION public.create_sales_agent_application_secure(
  p_user_id uuid,
  p_full_name text,
  p_email text,
  p_phone text DEFAULT NULL,
  p_why_join text DEFAULT NULL,
  p_business_experience text DEFAULT NULL,
  p_marketing_ideas text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  application_id UUID;
  data_hash TEXT;
BEGIN
  -- Validate UUID
  IF NOT public.validate_uuid_input(p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID format';
  END IF;

  -- Sanitize and validate text inputs with length limits
  p_full_name := public.sanitize_text_input(p_full_name, 200);
  p_email := public.sanitize_text_input(p_email, 255);
  p_phone := public.sanitize_text_input(p_phone, 50);
  p_why_join := public.sanitize_text_input(p_why_join, 1000);
  p_business_experience := public.sanitize_text_input(p_business_experience, 1000);
  p_marketing_ideas := public.sanitize_text_input(p_marketing_ideas, 1000);

  -- Validate required fields
  IF p_full_name IS NULL OR p_full_name = '' THEN
    RAISE EXCEPTION 'Full name is required';
  END IF;
  
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;
  
  -- Validate email format with improved regex
  IF p_email !~ '^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9][A-Za-z0-9.-]*\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Create the main application record
  INSERT INTO public.sales_agent_applications (
    user_id,
    why_join,
    business_experience,
    marketing_ideas,
    application_status
  ) VALUES (
    p_user_id,
    p_why_join,
    p_business_experience,
    p_marketing_ideas,
    'pending'
  ) RETURNING id INTO application_id;
  
  -- Create hash for integrity verification
  data_hash := encode(digest(p_full_name || p_email || COALESCE(p_phone, ''), 'sha256'), 'hex');
  
  -- Store encrypted personal data separately
  INSERT INTO public.sales_agent_applications_personal_data (
    application_id,
    encrypted_full_name,
    encrypted_email,
    encrypted_phone,
    data_hash
  ) VALUES (
    application_id,
    p_full_name,
    p_email,
    p_phone,
    data_hash
  );
  
  -- Log the creation
  INSERT INTO public.security_audit_log (
    action,
    table_name,
    record_id,
    user_id,
    timestamp
  ) VALUES (
    'application_created_with_personal_data',
    'sales_agent_applications',
    application_id,
    p_user_id,
    now()
  );
  
  RETURN application_id;
END;
$function$;

-- Update secure_change_user_role with input validation
CREATE OR REPLACE FUNCTION public.secure_change_user_role(
  target_user_id uuid,
  new_role app_role,
  reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    current_user_id UUID;
    old_role user_role;
    result JSONB;
BEGIN
    -- Validate UUID
    IF NOT public.validate_uuid_input(target_user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid user ID format'
        );
    END IF;

    -- Sanitize reason text
    reason := public.sanitize_text_input(reason, 500);

    current_user_id := auth.uid();
    
    -- Only admins can change roles
    IF NOT public.is_admin_secure() THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Access denied. Admin privileges required.'
        );
    END IF;
    
    -- Get current role
    SELECT role INTO old_role 
    FROM public.profiles 
    WHERE id = target_user_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'User not found.'
        );
    END IF;
    
    -- Log the personal data access
    INSERT INTO public.personal_data_access_audit (
        accessed_by, target_user_id, data_type, access_reason
    ) VALUES (
        current_user_id, target_user_id, 'role_change', reason
    );
    
    -- Update role in profiles table
    UPDATE public.profiles 
    SET role = new_role::user_role, updated_at = now()
    WHERE id = target_user_id;
    
    -- Update/insert in user_roles table
    INSERT INTO public.user_roles (user_id, role, granted_by)
    VALUES (target_user_id, new_role, current_user_id)
    ON CONFLICT (user_id, role) 
    DO UPDATE SET granted_by = current_user_id, granted_at = now();
    
    -- Log the role change with sanitized reason
    INSERT INTO public.role_change_audit (
        user_id, old_role, new_role, changed_by, reason
    ) VALUES (
        target_user_id, old_role, new_role::user_role, current_user_id, reason
    );
    
    result := jsonb_build_object(
        'success', true,
        'old_role', old_role,
        'new_role', new_role,
        'changed_at', now()
    );
    
    RETURN result;
END;
$function$;

-- Update access_personal_data_secure with input validation
CREATE OR REPLACE FUNCTION public.access_personal_data_secure(
  target_user_id uuid,
  data_type text,
  access_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id UUID;
  rate_limit_result JSONB;
  result JSONB;
BEGIN
  -- Validate UUID
  IF NOT public.validate_uuid_input(target_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID format';
  END IF;

  -- Sanitize text inputs
  data_type := public.sanitize_text_input(data_type, 100);
  access_reason := public.sanitize_text_input(access_reason, 500);

  current_user_id := auth.uid();
  
  -- Block if not authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Block if not admin
  IF NOT public.is_admin_secure() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Check and enforce rate limits
  SELECT public.check_rate_limit_secure('personal_data_access', 10, 60) INTO rate_limit_result;
  
  IF NOT (rate_limit_result->>'allowed')::boolean THEN
    RAISE EXCEPTION 'Rate limit exceeded for personal data access.';
  END IF;
  
  -- Log successful access
  INSERT INTO public.personal_data_access_audit (
    accessed_by, target_user_id, data_type, access_reason
  ) VALUES (
    current_user_id, target_user_id, data_type, access_reason
  );
  
  result := jsonb_build_object(
    'success', true,
    'access_granted_at', now(),
    'access_reason', access_reason
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Log failed attempt with sanitized error
    INSERT INTO public.security_audit_log (
      action, table_name, user_id, user_agent, timestamp
    ) VALUES (
      'failed_personal_data_access',
      'profiles',
      current_user_id,
      public.sanitize_text_input(SQLERRM, 500),
      now()
    );
    
    RAISE;
END;
$function$;