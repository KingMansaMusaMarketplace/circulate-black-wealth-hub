-- Add admin role for the user
INSERT INTO public.user_roles (user_id, role)
VALUES ('bd72a75e-1310-4f40-9c74-380443b09d9b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;