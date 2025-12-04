-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create profiles for any existing auth users that don't have profiles
INSERT INTO public.profiles (id, user_type, email, full_name)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'user_type', 'customer'),
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', '')
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = au.id);

-- Also add default customer role for any users missing roles
INSERT INTO public.user_roles (user_id, role)
SELECT au.id, 'customer'::app_role
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = au.id)
ON CONFLICT (user_id, role) DO NOTHING;