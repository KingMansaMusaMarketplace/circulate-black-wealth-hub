-- Fix Sales Agent Data Exposure - Critical Security Issue
-- Remove overly permissive policies and add proper access controls

-- Drop existing overly permissive policy if it exists
DROP POLICY IF EXISTS "Agents can view their own complete profile" ON public.sales_agents;

-- Create secure policies for sales agents table
CREATE POLICY "Agents can view their own profile" 
ON public.sales_agents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sales agents" 
ON public.sales_agents 
FOR ALL 
USING (public.is_admin());

-- Create a secure function for public referral code access only
CREATE OR REPLACE FUNCTION public.get_active_referral_codes()
RETURNS TABLE(referral_code text, is_active boolean) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Only return minimal data needed for referral functionality
    RETURN QUERY
    SELECT 
        sa.referral_code,
        sa.is_active
    FROM sales_agents sa
    WHERE sa.is_active = true;
END;
$$;

-- Enhanced security for sponsors table - ensure only owners and admins can access
CREATE POLICY "Admins can view all sponsors" 
ON public.sponsors 
FOR SELECT 
USING (public.is_admin());

-- Add audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    timestamp timestamp with time zone DEFAULT now(),
    ip_address inet,
    user_agent text
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (public.is_admin());