-- Add signup platform tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS signup_platform VARCHAR(50) DEFAULT 'web',
ADD COLUMN IF NOT EXISTS signup_device_info TEXT;

-- Update the handle_new_user function to capture platform info
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, email, full_name, signup_platform, signup_device_info)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'customer'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'signup_platform', 'web'),
    NEW.raw_user_meta_data->>'device_info'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.signup_platform IS 'Platform user signed up from: web, ios, android';