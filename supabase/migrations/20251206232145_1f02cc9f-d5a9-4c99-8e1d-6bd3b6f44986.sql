-- Fix the has_role function that checks profiles to use correct column name
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE 
      id = _user_id AND 
      user_type = _role
  );
$$;