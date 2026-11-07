INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) = 'thomas@1325.ai'
ON CONFLICT (user_id, role) DO NOTHING;