-- Fix delete_user_account function with proper authorization check
CREATE OR REPLACE FUNCTION public.delete_user_account(user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- CRITICAL: Verify the caller is the account owner
  IF auth.uid() != user_id THEN 
    RAISE EXCEPTION 'You can only delete your own account'; 
  END IF;
  
  -- Delete user data in proper order (respecting foreign keys)
  DELETE FROM public.customer_loyalty WHERE customer_id = user_id;
  DELETE FROM public.customer_favorites WHERE customer_id = user_id;
  DELETE FROM public.customer_visits WHERE customer_id = user_id;
  DELETE FROM public.qr_codes WHERE business_id IN (SELECT id FROM public.businesses WHERE owner_id = user_id);
  DELETE FROM public.businesses WHERE owner_id = user_id;
  DELETE FROM public.business_reviews WHERE customer_id = user_id;
  DELETE FROM public.notifications WHERE user_id = user_id;
  DELETE FROM public.search_history WHERE user_id = user_id;
  DELETE FROM public.profiles WHERE id = user_id;
END; 
$function$;