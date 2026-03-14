-- Fix 1: Update handle_new_user to include user_type and email from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _full_name text;
  _avatar_url text;
  _user_type text;
  _email text;
BEGIN
  _full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    split_part(NEW.email, '@', 1)
  );
  _avatar_url := COALESCE(
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'picture'
  );
  _user_type := COALESCE(
    NEW.raw_user_meta_data ->> 'user_type',
    'customer'
  );
  _email := NEW.email;

  INSERT INTO public.profiles (id, full_name, avatar_url, user_type, email)
  VALUES (NEW.id, _full_name, _avatar_url, _user_type, _email)
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    user_type = COALESCE(EXCLUDED.user_type, profiles.user_type),
    email = COALESCE(EXCLUDED.email, profiles.email);

  RETURN NEW;
END;
$$;

-- Fix 2: Add INSERT policy for businesses so authenticated users can create their own business
CREATE POLICY "Users can create own business"
  ON public.businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);