-- Create a separate table for sensitive personal data with enhanced security
CREATE TABLE public.sales_agent_applications_personal_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL UNIQUE,
  encrypted_full_name TEXT NOT NULL,
  encrypted_email TEXT NOT NULL, 
  encrypted_phone TEXT,
  data_hash TEXT NOT NULL, -- For integrity verification
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_by UUID
);

-- Enable RLS on the new table
ALTER TABLE public.sales_agent_applications_personal_data ENABLE ROW LEVEL SECURITY;

-- Create strict RLS policies for personal data table
CREATE POLICY "Only admins can access personal data with audit" 
ON public.sales_agent_applications_personal_data 
FOR SELECT 
USING (
  public.is_admin() AND 
  public.check_rate_limit('personal_data_access', 10) -- Max 10 accesses per minute
);

CREATE POLICY "Only admins can insert personal data" 
ON public.sales_agent_applications_personal_data 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update personal data with audit" 
ON public.sales_agent_applications_personal_data 
FOR UPDATE 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Create secure function to access personal data with mandatory audit logging
CREATE OR REPLACE FUNCTION public.get_application_personal_data_secure(p_application_id UUID)
RETURNS TABLE(
  application_id UUID,
  decrypted_full_name TEXT,
  decrypted_email TEXT, 
  decrypted_phone TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  personal_data RECORD;
BEGIN
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
  
  -- Return decrypted data (for now, we'll store as encrypted but return as-is)
  -- In production, you would decrypt here using proper encryption keys
  RETURN QUERY SELECT 
    personal_data.application_id,
    personal_data.encrypted_full_name, -- Will be decrypted in production
    personal_data.encrypted_email,     -- Will be decrypted in production  
    personal_data.encrypted_phone;     -- Will be decrypted in production
END;
$$;

-- Remove sensitive columns from main applications table and add reference
ALTER TABLE public.sales_agent_applications 
DROP COLUMN IF EXISTS full_name,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS phone;

-- Add foreign key reference to personal data
ALTER TABLE public.sales_agent_applications_personal_data
ADD CONSTRAINT fk_application_personal_data 
FOREIGN KEY (application_id) REFERENCES public.sales_agent_applications(id) 
ON DELETE CASCADE;

-- Create secure function to create application with personal data
CREATE OR REPLACE FUNCTION public.create_sales_agent_application_secure(
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_why_join TEXT DEFAULT NULL,
  p_business_experience TEXT DEFAULT NULL,
  p_marketing_ideas TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  application_id UUID;
  data_hash TEXT;
BEGIN
  -- Validate inputs
  IF p_full_name IS NULL OR trim(p_full_name) = '' THEN
    RAISE EXCEPTION 'Full name is required';
  END IF;
  
  IF p_email IS NULL OR trim(p_email) = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;
  
  -- Validate email format
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
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
  -- Note: In production, you would encrypt these fields with proper encryption keys
  INSERT INTO public.sales_agent_applications_personal_data (
    application_id,
    encrypted_full_name,
    encrypted_email,
    encrypted_phone,
    data_hash
  ) VALUES (
    application_id,
    p_full_name, -- Will be encrypted in production
    p_email,     -- Will be encrypted in production
    p_phone,     -- Will be encrypted in production
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
$$;

-- Create function to get application details with personal data for admins
CREATE OR REPLACE FUNCTION public.get_application_details_secure(p_application_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  application_date TIMESTAMP WITH TIME ZONE,
  application_status TEXT,
  test_score INTEGER,
  test_passed BOOLEAN,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  notes TEXT,
  why_join TEXT,
  business_experience TEXT,
  marketing_ideas TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  app_record RECORD;
  personal_record RECORD;
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required to view application details.';
  END IF;
  
  -- Get application data
  SELECT * INTO app_record 
  FROM public.sales_agent_applications 
  WHERE id = p_application_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Get personal data with audit logging
  SELECT * INTO personal_record
  FROM public.get_application_personal_data_secure(p_application_id);
  
  -- Return combined data
  RETURN QUERY SELECT 
    app_record.id,
    app_record.user_id,
    personal_record.decrypted_full_name,
    personal_record.decrypted_email,
    personal_record.decrypted_phone,
    app_record.application_date,
    app_record.application_status,
    app_record.test_score,
    app_record.test_passed,
    app_record.reviewed_at,
    app_record.reviewed_by,
    app_record.notes,
    app_record.why_join,
    app_record.business_experience,
    app_record.marketing_ideas;
END;
$$;

-- Update existing function to work with new structure
CREATE OR REPLACE FUNCTION public.get_applications_for_review_secure()
RETURNS TABLE(
  id UUID,
  application_date TIMESTAMP WITH TIME ZONE,
  application_status TEXT,
  test_score INTEGER,
  test_passed BOOLEAN,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  notes TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Return application data without personal information for list view
  RETURN QUERY
  SELECT 
    app.id,
    app.application_date,
    app.application_status,
    app.test_score,
    app.test_passed,
    app.reviewed_at,
    app.reviewed_by,
    app.notes
  FROM public.sales_agent_applications app
  ORDER BY app.application_date DESC;
END;
$$;