-- Fix function search path security warnings
-- Update account deletion functions to have proper search path

CREATE OR REPLACE FUNCTION public.request_account_deletion(deletion_reason TEXT DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Update immediate account deletion function
CREATE OR REPLACE FUNCTION public.delete_user_account_immediate()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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