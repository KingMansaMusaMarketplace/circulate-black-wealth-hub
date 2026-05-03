-- Drop the legacy single-argument has_role overload that reads from profiles.role
-- This function is dead/dangerous code. The two-argument variant
-- has_role(_user_id uuid, _role app_role) reading from public.user_roles is the
-- only authoritative role check and is what the application actually calls.
DROP FUNCTION IF EXISTS public.has_role(_role public.user_role);