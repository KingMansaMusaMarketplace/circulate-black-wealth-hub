-- Create account deletion functionality
-- Add account deletion request table to track deletion requests
CREATE TABLE public.account_deletion_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own deletion requests
CREATE POLICY "Users can view their own deletion requests" 
ON public.account_deletion_requests 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own deletion requests
CREATE POLICY "Users can create their own deletion requests" 
ON public.account_deletion_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admins can view all deletion requests
CREATE POLICY "Admins can view all deletion requests" 
ON public.account_deletion_requests 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Function to handle account deletion
CREATE OR REPLACE FUNCTION public.request_account_deletion(deletion_reason TEXT DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
  deletion_request_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;
  
  -- Check if user already has a pending deletion request
  IF EXISTS (
    SELECT 1 FROM public.account_deletion_requests 
    WHERE user_id = current_user_id 
    AND status = 'pending'
  ) THEN
    RETURN json_build_object('error', 'Account deletion already requested');
  END IF;
  
  -- Create deletion request
  INSERT INTO public.account_deletion_requests (user_id, reason)
  VALUES (current_user_id, deletion_reason)
  RETURNING id INTO deletion_request_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Account deletion requested successfully',
    'request_id', deletion_request_id
  );
END;
$$;

-- Function for immediate account deletion (if user wants instant deletion)
CREATE OR REPLACE FUNCTION public.delete_user_account_immediate()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;
  
  -- Log the deletion request
  INSERT INTO public.account_deletion_requests (user_id, reason, status, processed_at)
  VALUES (current_user_id, 'Immediate deletion requested', 'completed', now());
  
  -- Delete user profile and related data (cascades will handle cleanup)
  DELETE FROM public.profiles WHERE id = current_user_id;
  
  -- Delete the auth user (this triggers all cascading deletes)
  DELETE FROM auth.users WHERE id = current_user_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Account deleted successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', 'Failed to delete account: ' || SQLERRM);
END;
$$;