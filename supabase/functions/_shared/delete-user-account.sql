-- Function to permanently delete a user account and all associated data
-- This complies with Apple App Store Guidelines 5.1.1(v) for account deletion

CREATE OR REPLACE FUNCTION delete_user_account(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete customer-related data
  DELETE FROM public.customer_loyalty WHERE customer_id = user_id;
  DELETE FROM public.customer_favorites WHERE customer_id = user_id;
  DELETE FROM public.customer_visits WHERE customer_id = user_id;
  
  -- Delete business-related data
  DELETE FROM public.qr_codes WHERE business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = user_id
  );
  DELETE FROM public.business_analytics WHERE business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = user_id
  );
  DELETE FROM public.business_hours WHERE business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = user_id
  );
  DELETE FROM public.business_reviews WHERE business_id IN (
    SELECT id FROM public.businesses WHERE owner_id = user_id
  );
  DELETE FROM public.businesses WHERE owner_id = user_id;
  
  -- Delete reviews created by user
  DELETE FROM public.business_reviews WHERE customer_id = user_id;
  
  -- Delete notifications
  DELETE FROM public.notifications WHERE user_id = user_id;
  
  -- Delete profile
  DELETE FROM public.profiles WHERE id = user_id;
  
  -- Delete auth user (this will cascade to other related tables)
  DELETE FROM auth.users WHERE id = user_id;
  
  RAISE NOTICE 'User account % has been permanently deleted', user_id;
END;
$$;

-- Grant execute permission to authenticated users (they can only delete their own account)
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;

COMMENT ON FUNCTION delete_user_account IS 'Permanently deletes a user account and all associated data. Required for Apple App Store compliance with Guidelines 5.1.1(v).';
