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

  _user_type := CASE lower(COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'customer'))
    WHEN 'business' THEN 'business'
    WHEN 'admin' THEN 'admin'
    ELSE 'customer'
  END;

  _email := NEW.email;

  BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, user_type, email)
    VALUES (NEW.id, _full_name, _avatar_url, _user_type, _email)
    ON CONFLICT (id) DO UPDATE SET
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
      user_type = COALESCE(EXCLUDED.user_type, profiles.user_type),
      email = COALESCE(EXCLUDED.email, profiles.email);
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'handle_new_user primary insert failed for user % (%): % [%]', NEW.id, NEW.email, SQLERRM, SQLSTATE;

    BEGIN
      INSERT INTO public.profiles (id, full_name, user_type, email)
      VALUES (NEW.id, COALESCE(_full_name, split_part(NEW.email, '@', 1)), 'customer', _email)
      ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      RAISE LOG 'handle_new_user fallback insert failed for user % (%): % [%]', NEW.id, NEW.email, SQLERRM, SQLSTATE;
    END;
  END;

  RETURN NEW;
END;
$$;