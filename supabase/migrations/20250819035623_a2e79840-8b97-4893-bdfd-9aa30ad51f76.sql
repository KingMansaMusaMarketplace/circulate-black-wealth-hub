-- Fix security warnings by setting search_path for functions

-- Update handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    user_type,
    full_name, 
    email
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'customer'),
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Update generate_referral_code_for_profile function with proper search_path
CREATE OR REPLACE FUNCTION public.generate_referral_code_for_profile()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := UPPER(SUBSTRING(REPLACE(CAST(gen_random_uuid() AS TEXT), '-', ''), 1, 8));
  END IF;
  RETURN NEW;
END;
$$;