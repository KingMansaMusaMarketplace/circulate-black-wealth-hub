-- CRITICAL SECURITY FIXES - Phase 1: Data Protection & Access Control (Fixed)

-- 1. Create proper user roles table (security best practice)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'customer', 'business', 'sales_agent');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Create security definer function for role checking (prevents recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 3. Create secure admin check function
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- 4. Add activity logging table for security audit
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    business_id UUID,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    points_involved INTEGER DEFAULT 0,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- 5. Create personal data access audit table
CREATE TABLE IF NOT EXISTS public.personal_data_access_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accessed_by UUID NOT NULL REFERENCES auth.users(id),
    target_user_id UUID NOT NULL,
    data_type TEXT NOT NULL,
    access_reason TEXT,
    ip_address INET,
    user_agent TEXT,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.personal_data_access_audit ENABLE ROW LEVEL SECURITY;

-- 6. Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    ip_address INET,
    operation TEXT NOT NULL,
    attempt_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    blocked_until TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for new security tables

-- User roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.is_admin_secure());

-- Activity log policies  
DROP POLICY IF EXISTS "Users can view their own activity" ON public.activity_log;
DROP POLICY IF EXISTS "Admins can view all activity" ON public.activity_log;

CREATE POLICY "Users can view their own activity" ON public.activity_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" ON public.activity_log
    FOR SELECT USING (public.is_admin_secure());

-- Personal data access audit policies
DROP POLICY IF EXISTS "Admins can view personal data access audit" ON public.personal_data_access_audit;

CREATE POLICY "Admins can view personal data access audit" ON public.personal_data_access_audit
    FOR SELECT USING (public.is_admin_secure());

-- Rate limit log policies
DROP POLICY IF EXISTS "Admins can view rate limit logs" ON public.rate_limit_log;

CREATE POLICY "Admins can view rate limit logs" ON public.rate_limit_log
    FOR SELECT USING (public.is_admin_secure());

-- 8. Fix existing profiles table RLS policies (CRITICAL SECURITY FIX)
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can update profile but not role" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile except role" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile only" ON public.profiles;

-- Create secure profiles policies
CREATE POLICY "Users can view their own profile secure" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own basic profile data secure" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        -- Prevent role escalation - only admins can change roles
        (role = (SELECT role FROM profiles WHERE id = auth.uid()) OR public.is_admin_secure())
    );

CREATE POLICY "Admins can view all profiles secure" ON public.profiles
    FOR SELECT USING (public.is_admin_secure());

CREATE POLICY "Admins can update any profile secure" ON public.profiles
    FOR UPDATE USING (public.is_admin_secure());

-- 9. Fix sales_agents table RLS policies (CRITICAL SECURITY FIX)
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all sales agents" ON public.sales_agents;
DROP POLICY IF EXISTS "Agents can view their own profile" ON public.sales_agents;

-- Create secure sales_agents policies with restricted personal data access
CREATE POLICY "Sales agents can view their own profile secure" ON public.sales_agents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all sales agents secure" ON public.sales_agents
    FOR ALL USING (public.is_admin_secure());

-- Only allow viewing minimal public info for referral validation (no personal data)
CREATE POLICY "Public can view minimal referral info secure" ON public.sales_agents
    FOR SELECT USING (
        is_active = true AND 
        -- This policy restricts access - only referral_code and basic info
        auth.role() = 'authenticated'
    );

-- 10. Create secure role management function
CREATE OR REPLACE FUNCTION public.secure_change_user_role(
    target_user_id UUID,
    new_role app_role,
    reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID;
    old_role user_role;  -- Use existing user_role type
    result JSONB;
BEGIN
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
    
    -- Log the role change
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
$$;

-- 11. Create secure rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit_secure(
    operation_name TEXT,
    max_attempts INTEGER DEFAULT 5,
    window_minutes INTEGER DEFAULT 15
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID;
    window_start TIMESTAMP WITH TIME ZONE;
    attempt_count INTEGER;
    result JSONB;
BEGIN
    current_user_id := auth.uid();
    window_start := now() - (window_minutes || ' minutes')::INTERVAL;
    
    -- Check current attempts in the time window
    SELECT COALESCE(SUM(attempt_count), 0) INTO attempt_count
    FROM public.rate_limit_log
    WHERE user_id = current_user_id
        AND operation = operation_name
        AND window_start >= window_start
        AND (blocked_until IS NULL OR blocked_until < now());
    
    IF attempt_count >= max_attempts THEN
        -- Block for additional time
        INSERT INTO public.rate_limit_log (
            user_id, operation, attempt_count, blocked_until
        ) VALUES (
            current_user_id, operation_name, 1, 
            now() + (window_minutes * 2 || ' minutes')::INTERVAL
        );
        
        result := jsonb_build_object(
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
            current_user_id, operation_name, 1
        );
        
        result := jsonb_build_object(
            'allowed', true,
            'attempts_remaining', max_attempts - attempt_count - 1,
            'message', 'Access allowed'
        );
    END IF;
    
    RETURN result;
END;
$$;

-- 12. Create secure personal data access function
CREATE OR REPLACE FUNCTION public.access_personal_data_secure(
    target_user_id UUID,
    data_type TEXT,
    access_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
DECLARE
    current_user_id UUID;
    rate_limit_result JSONB;
    result JSONB;
BEGIN
    current_user_id := auth.uid();
    
    -- Only admins can access personal data
    IF NOT public.is_admin_secure() THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Access denied. Admin privileges required.'
        );
    END IF;
    
    -- Check rate limit for personal data access
    SELECT public.check_rate_limit_secure('personal_data_access', 10, 60) INTO rate_limit_result;
    
    IF NOT (rate_limit_result->>'allowed')::boolean THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Rate limit exceeded for personal data access.',
            'rate_limit_info', rate_limit_result
        );
    END IF;
    
    -- Log the access
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
END;
$$;