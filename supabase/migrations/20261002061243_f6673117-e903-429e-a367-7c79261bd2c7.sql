CREATE OR REPLACE FUNCTION public.create_sales_agent_application_secure(p_user_id uuid, p_full_name text, p_email text, p_phone text DEFAULT NULL::text, p_why_join text DEFAULT NULL::text, p_business_experience text DEFAULT NULL::text, p_marketing_ideas text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  application_id UUID;
  data_hash TEXT;
BEGIN
  IF coalesce(auth.role(),'') <> 'service_role' AND p_user_id IS DISTINCT FROM auth.uid()
     AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'You can only do this for your own account' USING ERRCODE = '42501';
  END IF;
  IF NOT public.validate_uuid_input(p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID format';
  END IF;
  p_full_name := public.sanitize_text_input(p_full_name, 200);
  p_email := public.sanitize_text_input(p_email, 255);
  p_phone := public.sanitize_text_input(p_phone, 50);
  p_why_join := public.sanitize_text_input(p_why_join, 1000);
  p_business_experience := public.sanitize_text_input(p_business_experience, 1000);
  p_marketing_ideas := public.sanitize_text_input(p_marketing_ideas, 1000);
  IF p_full_name IS NULL OR p_full_name = '' THEN
    RAISE EXCEPTION 'Full name is required';
  END IF;
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;
  IF p_email !~ '^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9][A-Za-z0-9.-]*\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  INSERT INTO public.sales_agent_applications (user_id, why_join, business_experience, marketing_ideas, application_status)
  VALUES (p_user_id, p_why_join, p_business_experience, p_marketing_ideas, 'pending')
  RETURNING id INTO application_id;
  data_hash := encode(extensions.digest(p_full_name || p_email || COALESCE(p_phone, ''), 'sha256'), 'hex');
  INSERT INTO public.sales_agent_applications_personal_data (application_id, encrypted_full_name, encrypted_email, encrypted_phone, data_hash)
  VALUES (application_id, p_full_name, p_email, p_phone, data_hash);
  INSERT INTO public.security_audit_log (action, table_name, record_id, user_id, timestamp)
  VALUES ('application_created_with_personal_data', 'sales_agent_applications', application_id, p_user_id, now());
  RETURN application_id;
END;
$function$;